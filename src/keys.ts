import { UserService } from '@loopback/authentication'
import { BindingKey } from '@loopback/context'
import { User } from './models'
import { Credentials } from './repositories'
import { PasswordHasher } from './services'
import { FileUploadHandler } from './types'

export namespace PasswordHasherBindings {
  export const PASSWORD_HASHER =
    BindingKey.create<PasswordHasher>('services.hasher')
  export const ROUNDS = BindingKey.create<number>('services.hasher.round')
}

export namespace UserServiceBindings {
  export const USER_SERVICE = BindingKey.create<UserService<User, Credentials>>(
    'services.user.service',
  )
}

/**
 * Binding key for the file upload service
 */
export const FILE_UPLOAD_SERVICE = BindingKey.create<FileUploadHandler>(
  'services.FileUpload',
)

/**
 * Binding key for the storage directory
 */
export const STORAGE_DIRECTORY = BindingKey.create<string>('storage.directory')
