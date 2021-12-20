// Uncomment these imports to begin using these cool features!

// import {inject} from '@loopback/core';

import {
  authenticate,
  TokenService,
  UserService,
} from '@loopback/authentication'
import { TokenServiceBindings } from '@loopback/authentication-jwt'
import { inject } from '@loopback/core'
import { repository } from '@loopback/repository'
import { get, HttpErrors, post, put, requestBody } from '@loopback/rest'
import { SecurityBindings, securityId, UserProfile } from '@loopback/security'
import isEmail from 'isemail'
import _ from 'lodash'
import { SentMessageInfo } from 'nodemailer'
import { PasswordHasherBindings, UserServiceBindings } from '../keys'
import { KeyAndPassword, ResetPasswordInit, User } from '../models'
import {
  Credentials,
  UserRepository,
  UserResetCredentialRepository,
  WalletConnect,
  WalletCredentials,
  WalletInformation,
} from '../repositories'
import {
  PasswordHasher,
  validateCredentials,
  validateKeyPassword,
  VelvetUserService,
} from '../services'
import { OPERATION_SECURITY_SPEC } from '../utils'
import {
  CredentialsRequestBody,
  PasswordResetRequestBody,
  UserProfileSchema,
  WalletConnectRequestBody,
  WalletCredentialsRequestBody,
} from './specs/user-controller.specs'

export class AuthController {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public jwtService: TokenService,
    @inject(PasswordHasherBindings.PASSWORD_HASHER)
    public passwordHasher: PasswordHasher,
    @repository(UserResetCredentialRepository)
    public userResetCredentialRepository: UserResetCredentialRepository,
    @inject(UserServiceBindings.USER_SERVICE)
    public userService: UserService<User, Credentials>,
    @inject('services.VelvetUserService')
    public velvetUserService: VelvetUserService,
  ) {}

  @post('/auth/login', {
    responses: {
      '200': {
        description: 'Token',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                token: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
  })
  async login(
    @requestBody(CredentialsRequestBody) credentials: Credentials,
  ): Promise<{ token: string }> {
    // ensure the user exists, and the password is correct
    const user = await this.userService.verifyCredentials(credentials)

    // convert a User object into a UserProfile object (reduced set of properties)
    const userProfile = this.userService.convertToUserProfile(user)

    // create a JSON Web Token based on the user profile
    const token = await this.jwtService.generateToken(userProfile)

    return { token }
  }

  @post('/auth/wallet-login', {
    responses: {
      '200': {
        description: 'Token',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                token: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
  })
  async walletLogin(
    @requestBody(WalletCredentialsRequestBody) credentials: WalletCredentials,
  ): Promise<{ token: string }> {
    // ensure the user exists, and the password is correct
    const foundUser = await this.velvetUserService.getNonceUser({
      publicAddress: credentials.publicAddress,
    })
    if (!foundUser) {
      const account = await this.velvetUserService.createWalletUser(
        credentials.publicAddress,
      )
      // convert a User object into a UserProfile object (reduced set of properties)
      const userProfile = this.userService.convertToUserProfile(account)

      // create a JSON Web Token based on the user profile
      const token = await this.jwtService.generateToken(userProfile)

      return { token }
    }

    // convert a User object into a UserProfile object (reduced set of properties)
    const userProfile = this.userService.convertToUserProfile(foundUser)

    // create a JSON Web Token based on the user profile
    const token = await this.jwtService.generateToken(userProfile)

    return { token }
  }

  @post('/auth/wallet-connect', {
    responses: {
      '200': {
        description: 'Token',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                token: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
  })
  async walletConnect(
    @requestBody(WalletConnectRequestBody) wallet: WalletInformation,
  ): Promise<WalletConnect> {
    return this.velvetUserService.getNonce(wallet)
  }

  @put('/auth/forgot-password', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'The updated user profile',
        content: {
          'application/json': {
            schema: UserProfileSchema,
          },
        },
      },
    },
  })
  @authenticate('jwt')
  async forgotPassword(
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
    @requestBody(PasswordResetRequestBody) credentials: Credentials,
  ): Promise<{ token: string }> {
    const { email, password } = credentials
    const { id } = currentUserProfile

    const user = await this.userRepository.findById(id)

    if (!user) {
      throw new HttpErrors.NotFound('User account not found')
    }

    if (email !== user?.email) {
      throw new HttpErrors.Forbidden('Invalid email address')
    }

    validateCredentials(_.pick(credentials, ['email', 'password']))

    const passwordHash = await this.passwordHasher.hashPassword(password)

    await this.userRepository
      .userCredentials(user.id)
      .patch({ password: passwordHash })

    const userProfile = this.userService.convertToUserProfile(user)

    const token = await this.jwtService.generateToken(userProfile)

    return { token }
  }

  @post('/auth/reset-password/init', {
    responses: {
      '200': {
        description: 'Confirmation that reset password email has been sent',
      },
    },
  })
  async resetPasswordInit(
    @requestBody() resetPasswordInit: ResetPasswordInit,
  ): Promise<string> {
    if (!isEmail.validate(resetPasswordInit.email)) {
      throw new HttpErrors.UnprocessableEntity('Invalid email address')
    }

    const sentMessageInfo: SentMessageInfo =
      await this.velvetUserService.requestPasswordReset(resetPasswordInit.email)

    if (sentMessageInfo.accepted.length) {
      return 'Successfully sent reset password link'
    }
    throw new HttpErrors.InternalServerError(
      'Error sending reset password email',
    )
  }

  @put('/auth/reset-password/finish', {
    responses: {
      '200': {
        description: 'A successful password reset response',
      },
    },
  })
  async resetPasswordFinish(
    @requestBody() keyAndPassword: KeyAndPassword,
  ): Promise<string> {
    validateKeyPassword(keyAndPassword)

    const foundResetCredential =
      await this.userResetCredentialRepository.findOne({
        where: { resetKey: keyAndPassword.resetKey },
      })

    if (!foundResetCredential) {
      throw new HttpErrors.NotFound(
        'No associated account for the provided reset key',
      )
    }

    const credential = await this.velvetUserService.validateResetKeyLifeSpan(
      foundResetCredential,
    )

    const passwordHash = await this.passwordHasher.hashPassword(
      keyAndPassword.password,
    )

    try {
      await this.userRepository
        .userCredentials(foundResetCredential.userId)
        .patch({ password: passwordHash })

      await this.userResetCredentialRepository.updateById(
        credential.id,
        credential,
      )
    } catch (e) {
      return e
    }

    return 'Password reset successful'
  }

  @get('/auth/me', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'The current user profile',
        content: {
          'application/json': {
            schema: UserProfileSchema,
          },
        },
      },
    },
  })
  @authenticate('jwt')
  async printCurrentUser(
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
  ): Promise<User> {
    // FIXME: explore a way to generate OpenAPI schema
    // for symbol property

    const userId = currentUserProfile[securityId]
    return this.userRepository.findById(userId)
  }
}
