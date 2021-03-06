import { SchemaObject } from '@loopback/rest'

export const UserProfileSchema = {
  type: 'object',
  required: ['id'],
  properties: {
    id: { type: 'string' },
    email: { type: 'string' },
    name: { type: 'string' },
  },
}

// TODO: This is a workaround to manually
// describe the request body of 'Users/login'.
// We should either create a Credential model, or
// infer the spec from User model

const CredentialsSchema: SchemaObject = {
  type: 'object',
  required: ['email', 'password'],
  properties: {
    email: {
      type: 'string',
      format: 'email',
    },
    password: {
      type: 'string',
      minLength: 8,
    },
  },
}

export const CredentialsRequestBody = {
  description: 'The input of login function',
  required: true,
  content: {
    'application/json': { schema: CredentialsSchema },
  },
}

export const PasswordResetRequestBody = {
  description: 'The input of password reset function',
  required: true,
  content: {
    'application/json': { schema: CredentialsSchema },
  },
}

const WalletConnectSchema: SchemaObject = {
  type: 'object',
  required: ['publicAddress'],
  properties: {
    publicAddress: {
      type: 'string',
    },
  },
}

export const WalletConnectRequestBody = {
  description: 'The input of wallet connect function',
  required: true,
  content: {
    'application/json': { schema: WalletConnectSchema },
  },
}

const WalletCredentialsSchema: SchemaObject = {
  type: 'object',
  required: ['publicAddress', 'signature'],
  properties: {
    publicAddress: {
      type: 'string',
    },
    signature: {
      type: 'string',
    },
  },
}

export const WalletCredentialsRequestBody = {
  description: 'The input of wallet login function',
  required: true,
  content: {
    'application/json': { schema: WalletCredentialsSchema },
  },
}
