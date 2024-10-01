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
    input: String!
    attributes: [String!]!
    contentTypes: [String!]!
    maxFileSize: Int
    minFiles: Int
    maxFiles: Int
    presignedUrlHeader: String
  ) on FIELD_DEFINITION
`

const validate: ValidatorDirectiveFunc = ({ directiveArgs, args }) => {
  const {
    input: inputName,
    attributes,
    maxFileSize,
    minFiles,
    maxFiles,
    contentTypes,
    presignedUrlHeader,
  } = directiveArgs

  // TODO: get rules from storage config?
  const DEFAULT_MAX_FILE_SIZE = 1_000_000
  const DEFAULT_MAX_FILES = 10
  const DEFAULT_MIN_FILES = 1

  const sensibleMaxFileSize = maxFileSize ?? DEFAULT_MAX_FILE_SIZE
  const sensibleMaxFiles = maxFiles ?? DEFAULT_MAX_FILES
  const sensibleMinFiles = minFiles ?? DEFAULT_MIN_FILES
  const sensibleRequiredPresignedUrl = presignedUrlHeader ? true : false

  logger.debug({ headers: context.event?.['headers'] }, '>>> headers')

  // check context headers for presigned url
  if (sensibleRequiredPresignedUrl) {
    const headers = context.event?.['headers']

    logger.info({ headers }, 'Checking for presigned URL')

    const presignedUrl = headers[presignedUrlHeader]
    if (!presignedUrl) {
      throw new ValidationError('Presigned URL is required')
    }

    try {
      const decodedToken = jwt.verify(
        presignedUrl,
        process.env.STORAGE_SIGNING_SECRET
      )
      logger.debug({ decodedToken }, 'Decoded token')
    } catch (error) {
      logger.error({ error }, 'JWT verification failed')
      throw new AuthenticationError(
        'Authentication failed: Invalid presigned URL'
      )
    }
  }

  const inputData = args[inputName]

  attributes.forEach((attr) => {
    const files = inputData[attr] as File[]
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
}

const upload = createValidatorDirective(schema, validate)

export default upload
