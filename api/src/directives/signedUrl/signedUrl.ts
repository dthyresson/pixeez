import {
  createTransformerDirective,
  TransformerDirectiveFunc,
} from '@redwoodjs/graphql-server'

import { logger } from 'src/lib/logger'
import { storage } from 'src/lib/storage'
export const schema = gql`
  """
  Use @signedUrl to sign a url to fetch a file from storage.
  """
  directive @signedUrl on FIELD_DEFINITION
`

const transform: TransformerDirectiveFunc = async ({
  // context,
  resolvedValue,
}) => {
  const signedUrl = await storage.getSignedUrl(resolvedValue)
  logger.debug({ signedUrl, resolvedValue }, 'signedUrl in signedUrl directive')

  return signedUrl
}

const signedUrl = createTransformerDirective(schema, transform)

export default signedUrl
