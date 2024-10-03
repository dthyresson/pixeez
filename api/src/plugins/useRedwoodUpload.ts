import type { Plugin } from 'graphql-yoga'
import jwt from 'jsonwebtoken'

import type {
  RedwoodGraphQLContext,
  // GraphQLHandlerOptions,
} from '@redwoodjs/graphql-server'

export type UploadConfig = {
  contentTypes?: string[]
  maxFileSize?: number
  maxFiles?: number
  minFiles?: number
  expiresIn?: string | number
}

export type UploadTokenPayload = UploadConfig & {
  // Represents the application generating the token
  // app: string
  // Indicates the specific type of upload operation,
  // such as uploading an avatar or an image to a gallery.
  action: string
}

export type RedwoodUploadOptions = {
  appName: string
  uploadTarget: string
}

export const DEFAULT_UPLOAD_TOKEN_HEADER = 'x-rw-upload-token'

// set sensible defaults for content types, max file size, etc
// export const APP_NAME = 'pixeez'
// Represents where the upload is intended for to
//signify that it's for the upload functionality of your app,
// such as 'uploads'.
// export const UPLOAD_TARGET = 'uploads'
const IMAGE_CONTENT_TYPES = ['image/jpeg', 'image/png', 'image/gif']
const PDF_CONTENT_TYPE = 'application/pdf'
const MAX_FILE_SIZE = 1_000_000
const MAX_FILES = 3
const MIN_FILES = 1
const EXPIRES_IN = '1hr'

const DEFAULT_UPLOAD_CONFIG: UploadConfig = {
  contentTypes: [...IMAGE_CONTENT_TYPES, PDF_CONTENT_TYPE],
  maxFileSize: MAX_FILE_SIZE,
  maxFiles: MAX_FILES,
  minFiles: MIN_FILES,
  expiresIn: EXPIRES_IN,
}

export const createUploadToken = (payload: UploadTokenPayload) => {
  const secret = process.env.UPLOAD_TOKEN_SECRET

  if (!secret) {
    throw new Error('UPLOAD_TOKEN_SECRET is not set')
  }

  const { action, ...uploadConfig } = payload

  // merge the payload with the default payload
  const finalPayload = { ...DEFAULT_UPLOAD_CONFIG, ...uploadConfig }
  const { expiresIn = EXPIRES_IN, ...finalPayloadWithoutExpiresIn } =
    finalPayload

  const issuer = context.useRedwoodUploadAppName ?? 'new_pixeez'
  const audience = context.useRedwoodUploadTarget ?? 'new_RedwoodUpload'

  return jwt.sign(finalPayloadWithoutExpiresIn, secret, {
    algorithm: 'HS256',
    audience,
    issuer,
    subject: action,
    expiresIn, // This is now guaranteed to be a string or number
  })
}

export const useRedwoodUpload = (
  options: RedwoodUploadOptions
): Plugin<RedwoodGraphQLContext> => {
  return {
    async onContextBuilding({ extendContext }) {
      const { appName, uploadTarget } = options
      extendContext({
        useRedwoodUploadAppName: appName,
        useRedwoodUploadTarget: uploadTarget,
      })
    },
  }
}
