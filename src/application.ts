// JWT Authentication
import { AuthenticationComponent } from '@loopback/authentication'
import {
  JWTAuthenticationComponent,
  JWTService,
  SecuritySpecEnhancer,
  TokenServiceBindings,
  UserServiceBindings,
} from '@loopback/authentication-jwt'
import { BootMixin } from '@loopback/boot'
import { BindingKey } from '@loopback/context'
import { ApplicationConfig, createBindingFromClass } from '@loopback/core'
import { RepositoryMixin } from '@loopback/repository'
import { RestApplication } from '@loopback/rest'
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer'
import { ServiceMixin } from '@loopback/service-proxy'

import crypto from 'crypto'

import multer from 'multer'
import path from 'path'
import {
  FILE_UPLOAD_SERVICE,
  PasswordHasherBindings,
  STORAGE_DIRECTORY,
} from './keys'
import { ErrorHandlerMiddlewareProvider } from './middlewares'

import { MySequence } from './sequence'
import { BcryptHasher, VelvetUserService } from './services'

export { ApplicationConfig }

/**
 * Information from package.json
 */
export interface PackageInfo {
  name: string
  version: string
  description: string
}

export const PackageKey = BindingKey.create<PackageInfo>('application.package')

const pkg: PackageInfo = require('../package.json')

export class VelvetApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options)

    this.setUpBindings(options)

    // Set up the custom sequence
    this.sequence(MySequence)

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'))

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    })
    this.component(RestExplorerComponent)

    this.projectRoot = __dirname
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    }

    // Mount authentication system
    this.component(AuthenticationComponent)
    // Mount jwt component
    this.component(JWTAuthenticationComponent)
    // Bind datasource
    // this.dataSource(DbDataSource, UserServiceBindings.DATASOURCE_NAME)
  }

  setUpBindings(options: ApplicationConfig = {}): void {
    // Bind package.json to the application context
    this.bind(PackageKey).to(pkg)

    // Bind bcrypt hash services
    this.bind(PasswordHasherBindings.ROUNDS).to(10)
    this.bind(PasswordHasherBindings.PASSWORD_HASHER).toClass(BcryptHasher)
    this.bind(TokenServiceBindings.TOKEN_SERVICE).toClass(JWTService)

    this.bind(UserServiceBindings.USER_SERVICE).toClass(VelvetUserService)
    this.add(createBindingFromClass(SecuritySpecEnhancer))

    this.add(createBindingFromClass(ErrorHandlerMiddlewareProvider))

    // Use JWT secret from JWT_SECRET environment variable if set
    // otherwise create a random string of 64 hex digits
    const secret =
      process.env.JWT_SECRET ?? crypto.randomBytes(32).toString('hex')
    this.bind(TokenServiceBindings.TOKEN_SECRET).to(secret)

    // Configure file upload with multer options
    this.configureFileUpload(options.fileStorageDirectory)
  }

  /**
   * Configure `multer` options for file upload
   */
  protected configureFileUpload(destination?: string) {
    // Upload files to `public/uploads` by default
    destination = String(
      destination ??
        this.static('/', path.join(__dirname, '../public/uploads')),
    )
    this.bind(STORAGE_DIRECTORY).to(destination)
    const multerOptions: multer.Options = {
      storage: multer.diskStorage({
        destination,
        // Use the original file name as is
        filename: (req, file, cb) => {
          cb(null, file.originalname)
        },
      }),
    }
    // Configure the file upload service with multer options
    this.configure(FILE_UPLOAD_SERVICE).to(multerOptions)
  }
}
