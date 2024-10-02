import jwt from 'jsonwebtoken'

import {
  createValidatorDirective,
  AuthenticationError,
  ValidationError,
  ValidatorDirectiveFunc,
} from '@redwoodjs/graphql-server'

import { logger } from 'src/lib/logger'
import { APP_NAME, UPLOAD_TARGET } from 'src/services/uploads/util'

export const schema = gql`
  """
  Use @upload to validate file uploads with dynamic input and size constraints.
  """
  directive @upload(
    variable: String!
    fields: [String!]!
    uploadTokenHeader: String
  ) on FIELD_DEFINITION
`

const validate: ValidatorDirectiveFunc = ({ directiveArgs, args, context }) => {
  const { variable, fields, uploadTokenHeader } = directiveArgs
  let { maxFileSize, minFiles, maxFiles, contentTypes } = {} as {
    maxFileSize: number
    minFiles: number
    maxFiles: number
    contentTypes: string[]
  }

  const DEFAULT_UPLOAD_TOKEN_HEADER = 'x-rw-upload-token'

  const expectedUploadTokenHeader =
    uploadTokenHeader ?? DEFAULT_UPLOAD_TOKEN_HEADER

  // check context headers for presigned url
  if (expectedUploadTokenHeader) {
    const headers = context.event?.['headers']
    const { operationName } = context?.['params'] as { operationName: string }
    logger.debug({ operationName }, 'operationName')

    const uploadToken = headers[expectedUploadTokenHeader]
    if (!uploadToken) {
      throw new ValidationError('Upload token is required')
    }

    try {
      const decodedToken = jwt.verify(
        uploadToken,
        process.env.UPLOAD_TOKEN_SECRET,
        {
          algorithms: ['HS256'],
          audience: UPLOAD_TARGET,
          issuer: APP_NAME,
          subject: operationName,
        }
      )
      logger.debug({ decodedToken }, 'Decoded upload token')

      maxFileSize = decodedToken.maxFileSize
      minFiles = decodedToken.minFiles
      maxFiles = decodedToken.maxFiles
      contentTypes = decodedToken.contentTypes
    } catch (error) {
      logger.error({ error }, 'JWT verification failed')
      throw new AuthenticationError(
        'Authentication failed: Invalid upload token'
      )
    }
  }

  try {
    const inputVariable = args[variable]

    if (!inputVariable) {
      throw new ValidationError('Input variable for files is required')
    }

    fields.forEach((field) => {
      const files = inputVariable[field] as File[]
      const fileCount = files.length

      if (fileCount < minFiles) {
        logger.error({ minFiles, fileCount }, 'Too few files')
        throw new ValidationError(
          `Too few files. Min ${minFiles} files required`
        )
      }
      if (fileCount > maxFiles) {
        logger.error({ maxFiles, fileCount }, 'Too many files')
        throw new ValidationError(
          `Too many files. Max ${maxFiles} files allowed`
        )
      }

      files.forEach((file) => {
        if (!contentTypes.includes(file.type)) {
          logger.error({ contentTypes }, 'Invalid file type')
          throw new ValidationError(
            `Invalid file type. Allowed types: ${contentTypes.join(', ')}`
          )
        }

        if (file.size > maxFileSize) {
          logger.error(
            { size: file.size, maxFileSize },
            'File size exceeds the maximum allowed size'
          )
          throw new ValidationError(
            `File size exceeds the maximum allowed size. Max size: ${maxFileSize} bytes`
          )
        }
      })
    })
  } catch (error) {
    logger.error({ error }, 'Upload validation failed')
    throw new ValidationError(error.message)
  }
}

const upload = createValidatorDirective(schema, validate)

export default upload
