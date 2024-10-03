import jwt from 'jsonwebtoken'

import type { GlobalContext } from '@redwoodjs/context'
import {
  createValidatorDirective,
  AuthenticationError,
  ValidationError,
  ValidatorDirectiveFunc,
} from '@redwoodjs/graphql-server'

import { logger } from 'src/lib/logger'
import {
  UploadConfig,
  DEFAULT_UPLOAD_TOKEN_HEADER,
} from 'src/plugins/useRedwoodUpload'

export const schema = gql`
  """
  Use @upload to validate file uploads with dynamic input and size constraints.
  """
  directive @upload(variable: String!, fields: [String!]!) on FIELD_DEFINITION
`

const validateUploadToken = (context: GlobalContext) => {
  const headers = context.event?.['headers'] || {}
  const { operationName } = context?.['params'] as { operationName: string }

  if (!operationName) {
    throw new ValidationError('Operation name is required')
  }

  const uploadToken = headers[DEFAULT_UPLOAD_TOKEN_HEADER]
  if (!uploadToken) {
    throw new ValidationError('Upload token is required')
  }

  try {
    const decodedToken = jwt.verify(
      uploadToken,
      process.env.UPLOAD_TOKEN_SECRET,
      {
        algorithms: ['HS256'],
        audience: context.useRedwoodUploadTarget,
        issuer: context.useRedwoodUploadAppName,
        subject: operationName,
      }
    )
    logger.debug({ decodedToken }, 'Decoded upload token')
    return decodedToken
  } catch (error) {
    logger.error({ error }, 'JWT verification failed')
    throw new AuthenticationError('Authentication failed: Invalid upload token')
  }
}

const validateFiles = (
  files: File[],
  { minFiles, maxFiles, contentTypes, maxFileSize }: UploadConfig
) => {
  const fileCount = files.length

  if (minFiles !== undefined && fileCount < minFiles) {
    logger.error({ minFiles, fileCount }, 'Too few files')
    throw new ValidationError(`Too few files. Min ${minFiles} files required`)
  }
  if (maxFiles !== undefined && fileCount > maxFiles) {
    logger.error({ maxFiles, fileCount }, 'Too many files')
    throw new ValidationError(`Too many files. Max ${maxFiles} files allowed`)
  }

  files.forEach((file) => {
    if (contentTypes && !contentTypes.includes(file.type)) {
      logger.error({ contentTypes }, 'Invalid file type')
      throw new ValidationError(
        `Invalid file type. Allowed types: ${contentTypes.join(', ')}`
      )
    }

    if (maxFileSize !== undefined && file.size > maxFileSize) {
      logger.error(
        { size: file.size, maxFileSize },
        'File size exceeds the maximum allowed size'
      )
      throw new ValidationError(
        `File size exceeds the maximum allowed size. Max size: ${maxFileSize} bytes`
      )
    }
  })
}

const validate: ValidatorDirectiveFunc = ({ directiveArgs, args, context }) => {
  const { variable, fields } = directiveArgs

  const uploadConfig = validateUploadToken(context) as UploadConfig

  try {
    const inputVariable = args[variable]

    if (!inputVariable) {
      throw new ValidationError('Input variable for files is required')
    }

    fields.forEach((field) => {
      const files = inputVariable[field] as File[]
      validateFiles(files, uploadConfig)
    })
  } catch (error) {
    logger.error({ error }, 'Upload validation failed')
    throw new ValidationError(error.message)
  }
}

const upload = createValidatorDirective(schema, validate)

export default upload
