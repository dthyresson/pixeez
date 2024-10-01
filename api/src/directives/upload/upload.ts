import jwt from 'jsonwebtoken'

import {
  createValidatorDirective,
  AuthenticationError,
  ValidationError,
  ValidatorDirectiveFunc,
} from '@redwoodjs/graphql-server'

import { logger } from 'src/lib/logger'

export const schema = gql`
  """
  Use @upload to validate file uploads with dynamic input and size constraints.
  """
  directive @upload(
    variable: String!
    fields: [String!]!
    contentTypes: [String!]!
    maxFileSize: Int
    minFiles: Int
    maxFiles: Int
    uploadTokenHeader: String
  ) on FIELD_DEFINITION
`

const validate: ValidatorDirectiveFunc = ({ directiveArgs, args, context }) => {
  const {
    variable,
    fields,
    maxFileSize,
    minFiles,
    maxFiles,
    contentTypes,
    uploadTokenHeader,
  } = directiveArgs

  // TODO: get rules from storage config?
  const DEFAULT_MAX_FILE_SIZE = 1_000_000
  const DEFAULT_MAX_FILES = 10
  const DEFAULT_MIN_FILES = 1
  const DEFAULT_UPLOAD_TOKEN_HEADER = 'x-rw-upload-token'

  const sensibleMaxFileSize = maxFileSize ?? DEFAULT_MAX_FILE_SIZE
  const sensibleMaxFiles = maxFiles ?? DEFAULT_MAX_FILES
  const sensibleMinFiles = minFiles ?? DEFAULT_MIN_FILES
  const sensibleUploadTokenHeader =
    uploadTokenHeader ?? DEFAULT_UPLOAD_TOKEN_HEADER

  // check context headers for presigned url
  if (sensibleUploadTokenHeader) {
    const headers = context.event?.['headers']
    const { operationName } = context?.['params'] as { operationName: string }
    logger.debug({ operationName }, 'operationName')

    const uploadToken = headers[sensibleUploadTokenHeader]
    if (!uploadToken) {
      throw new ValidationError('Upload token is required')
    }

    try {
      const decodedToken = jwt.verify(
        uploadToken,
        process.env.UPLOAD_TOKEN_SECRET
      )
      logger.debug({ decodedToken }, 'Decoded upload token')

      // check that the aud claim is the operationName
      if (decodedToken.aud !== operationName) {
        throw new AuthenticationError(
          `Authentication failed: Invalid operationName: ${operationName}`
        )
      }
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

      if (fileCount < sensibleMinFiles) {
        logger.error({ minFiles, fileCount }, 'Too few files')
        throw new ValidationError(
          `Too few files. Min ${sensibleMinFiles} files required`
        )
      }
      if (fileCount > sensibleMaxFiles) {
        logger.error({ maxFiles, fileCount }, 'Too many files')
        throw new ValidationError(
          `Too many files. Max ${sensibleMaxFiles} files allowed`
        )
      }

      files.forEach((file) => {
        if (!contentTypes.includes(file.type)) {
          logger.error({ contentTypes }, 'Invalid file type')
          throw new ValidationError(
            `Invalid file type. Allowed types: ${contentTypes.join(', ')}`
          )
        }

        if (file.size > sensibleMaxFileSize) {
          logger.error(
            { size: file.size, sensibleMaxFileSize },
            'File size exceeds the maximum allowed size'
          )
          throw new ValidationError(
            `File size exceeds the maximum allowed size. Max size: ${sensibleMaxFileSize} bytes`
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
