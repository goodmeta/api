import { UserService } from '@loopback/authentication'
import { inject } from '@loopback/context'
import { repository } from '@loopback/repository'
import { HttpErrors } from '@loopback/rest'
import { securityId, UserProfile } from '@loopback/security'
import _ from 'lodash'
import { SentMessageInfo } from 'nodemailer'
import { v4 as uuidv4 } from 'uuid'
import { PasswordHasherBindings } from '../keys'
import { User, UserResetCredential, UserWithPassword } from '../models'
import {
  Credentials,
  UserRepository,
  UserResetCredentialRepository,
  WalletConnect,
  WalletInformation,
  WalletRepository,
} from '../repositories'
import { subtractDates } from '../utils'
import { EmailService } from './email.service'
import { PasswordHasher } from './hash.password.bcryptjs'

export class VelvetUserService implements UserService<User, Credentials> {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    @repository(UserResetCredentialRepository)
    public userResetCredentialRepository: UserResetCredentialRepository,
    @inject(PasswordHasherBindings.PASSWORD_HASHER)
    public passwordHasher: PasswordHasher,
    @inject('services.EmailService')
    public emailService: EmailService,
    @repository(WalletRepository)
    public walletRepository: WalletRepository,
  ) {}

  async verifyCredentials(credentials: Credentials): Promise<User> {
    const { email, password } = credentials
    const invalidCredentialsError = 'Invalid email or password.'

    if (!email) {
      throw new HttpErrors.Unauthorized(invalidCredentialsError)
    }
    const foundUser = await this.userRepository.findOne({
      where: { email },
    })
    if (!foundUser) {
      throw new HttpErrors.Unauthorized(invalidCredentialsError)
    }

    const credentialsFound = await this.userRepository.findCredentials(
      foundUser.id,
    )
    if (!credentialsFound) {
      throw new HttpErrors.Unauthorized(invalidCredentialsError)
    }

    const passwordMatched = await this.passwordHasher.comparePassword(
      password,
      credentialsFound.password,
    )

    if (!passwordMatched) {
      throw new HttpErrors.Unauthorized(invalidCredentialsError)
    }

    return foundUser
  }

  convertToUserProfile(user: User): UserProfile {
    return {
      [securityId]: user.id,
      name: user.name,
      id: user.id,
    }
  }

  async createUser(userWithPassword: UserWithPassword): Promise<User> {
    const password = await this.passwordHasher.hashPassword(
      userWithPassword.password,
    )
    userWithPassword.password = password
    const user = await this.userRepository.create(
      _.omit(userWithPassword, 'password'),
    )
    user.id = user.id.toString()
    await this.userRepository.userCredentials(user.id).create({ password })
    return user
  }

  async createWalletUser(walletAddress: string): Promise<User> {
    const user = await this.userRepository.create({
      name: walletAddress,
      // username: walletAddress,
      email: walletAddress,
    })
    user.id = user.id.toString()
    // await this.userRepository
    //   .wallets(user.id)
    //   .create({ address: walletAddress })
    return user
  }

  async requestPasswordReset(email: string): Promise<SentMessageInfo> {
    const noAccountFoundError =
      'No account associated with the provided email address.'
    const foundUser = await this.userRepository.findOne({
      where: { email },
    })

    if (!foundUser) {
      throw new HttpErrors.NotFound(noAccountFoundError)
    }

    const resetCredential = await this.updateResetRequestLimit(foundUser)

    try {
      if (resetCredential.id) {
        await this.userResetCredentialRepository.create(resetCredential)
      } else {
        await this.userResetCredentialRepository.update(resetCredential)
      }
    } catch (e) {
      return e
    }
    return this.emailService.sendResetPasswordMail(foundUser, resetCredential)
  }

  /**
   * Checks user reset timestamp if its same day increase count
   * otherwise set current date as timestamp and start counting
   * For first time reset request set reset count to 1 and assign same day timestamp
   * @param user
   */
  async updateResetRequestLimit(user: User): Promise<UserResetCredential> {
    const resetCredential =
      (await this.userRepository.findResetCredential(user.id)) ??
      new UserResetCredential()
    const resetTimestampDate = new Date(resetCredential.resetTimestamp)

    const difference = await subtractDates(resetTimestampDate)

    if (difference === 0) {
      resetCredential.resetCount = (resetCredential.resetCount || 0) + 1

      if (
        resetCredential.resetCount >
        +(process.env.PASSWORD_RESET_EMAIL_LIMIT ?? 2)
      ) {
        throw new HttpErrors.TooManyRequests(
          'Account has reached daily limit for sending password-reset requests',
        )
      }
    } else {
      resetCredential.resetTimestamp = new Date().toLocaleDateString()
      resetCredential.resetCount = 1
    }
    // For generating unique reset key there are other options besides the proposed solution below.
    // Feel free to use whatever option works best for your needs
    resetCredential.resetKey = uuidv4()
    resetCredential.resetKeyTimestamp = new Date().toLocaleDateString()

    return resetCredential
  }

  /**
   * Ensures reset key is only valid for a day
   * @param credential
   */
  async validateResetKeyLifeSpan(
    credential: UserResetCredential,
  ): Promise<UserResetCredential> {
    const resetKeyLifeSpan = new Date(credential.resetKeyTimestamp)
    const difference = await subtractDates(resetKeyLifeSpan)

    credential.resetKey = ''
    credential.resetKeyTimestamp = ''

    if (difference !== 0) {
      throw new HttpErrors.BadRequest('The provided reset key has expired.')
    }

    return credential
  }

  async getNonce(wallet: WalletInformation): Promise<WalletConnect> {
    const { publicAddress } = wallet

    const foundWallet = await this.walletRepository.findOne({
      where: { address: publicAddress },
    })
    if (!foundWallet) {
      return { publicAddress, nonce: uuidv4() }
    }

    const foundUser = await this.walletRepository.user(foundWallet.id)

    return { publicAddress, nonce: foundUser?.nonce ?? uuidv4() }
  }

  async getNonceUser(wallet: WalletInformation): Promise<User | undefined> {
    const { publicAddress } = wallet

    const foundWallet = await this.walletRepository.findOne({
      where: { address: publicAddress },
    })
    if (!foundWallet) {
      return undefined
    }

    return this.walletRepository.user(foundWallet.id)
  }
}
