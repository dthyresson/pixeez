import {
  createValidatorDirective,
  ValidationError,
  ValidatorDirectiveFunc,
} from '@redwoodjs/graphql-server'

import { logger } from 'src/lib/logger'

export const schema = gql`
  """
  Use @validateFiles to validate access to a field, query or mutation.
  """
  directive @validateFiles(
    files: [String!]!
    mimeTypes: [String!]!
    maxSize: Int!
    maxFiles: Int!
    maxFileSize: Int!
  ) on FIELD_DEFINITION
`

const validate: ValidatorDirectiveFunc = ({ args, context, directiveArgs }) => {
  /**
   * Write your validation logic inside this function.
   * Validator directives do not have access to the field value, i.e. they are called before resolving the value
   *
   * - Throw an error, if you want to stop executing e.g. not sufficient permissions
   * - Validator directives can be async or sync
   * - Returned value will be ignored
   */

  logger.debug({ args }, 'args in validateFiles directive')

  const headers = context.event['headers']
  logger.debug({ headers }, 'headers in validateFiles directive')

  const { mimeTypes, maxSize, maxFiles, maxFileSize } = directiveArgs

  // currentUser is only available when auth is setup.
  logger.debug({ directiveArgs }, 'args in validateFiles directive')
  const files = args['input'][directiveArgs['files']] as File[]

  // if no files throw
  if (!files) {
    throw new ValidationError('No files provided')
  }

  // if exceeds max files
  if (files.length > maxFiles) {
    throw new ValidationError(
      `You can only upload up to ${maxFiles} files at a time`
    )
  }

  // "context": {
  // api |     "event": {
  // api |       "body": "",
  // api |       "headers": {
  // api |         "accept": "*/*",
  // api |         "accept-encoding": "gzip, deflate",
  // api |         "accept-language": "en-US,en;q=0.9",
  // api |         "connection": "close",
  // api |         "content-length": "877",

  // get content length from context event
  const contentLength = context.event['headers']['content-length']
  logger.debug({ contentLength }, 'contentLength in validateFiles directive')
  // if contentLength > 1MB
  if (contentLength > maxFileSize) {
    throw new ValidationError(
      `Total upload size is too large ${contentLength} exceeds limit of ${maxFileSize}`
    )
  }

  // {
  //   api |   "args": {
  //   api |     "input": {
  //   api |       "albumId": "album_JfmEaYrWvxmUEQB1",
  //   api |       "originals": [

  // logger.debug({ args }, 'args in validateFiles directive')

  // "type": "image/png",
  // api |       "encoding": "utf8",
  // api |       "_size": null,
  // api |       "_buffer": null,
  // api |       "_text": null,
  // api |       "name": "output-onlinepngtools.png",
  // api |       "lastModified": 1726667818938,
  // api |       "webkitRelativePath": ""
  // api |     }

  // get file type

  // logger.debug({ files }, 'files in validateFiles directive')

  for (const file of files) {
    // logger.debug({ file }, 'file in validateFiles directive')

    // get file type
    const { type, size } = file
    logger.debug({ type }, 'type in validateFiles directive')
    logger.debug({ size }, 'size in validateFiles directive')
    // if type isn't an image
    if (!mimeTypes.includes(type)) {
      throw new ValidationError(`File is not an ${type}`)
    }

    // if size is greater than max size
    if (size > maxSize) {
      throw new ValidationError(
        `File is too large ${size} exceeds limit of ${maxSize}`
      )
    }
  }

  // You can also modify your directive to take arguments
  // and use the directiveArgs object provided to this function to get values
  // See documentation here: https://redwoodjs.com/docs/directives
  logger.debug(directiveArgs, 'directiveArgs in validateFiles directive')

  // throw new Error('Implementation missing for validateFiles')
}

const validateFiles = createValidatorDirective(schema, validate)

export default validateFiles
