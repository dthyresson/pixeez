import {
  createTransformerDirective,
  TransformerDirectiveFunc,
} from '@redwoodjs/graphql-server'

import { storage } from 'src/lib/storage'
export const schema = gql`
  """
  Use @signedUrl to sign a url to fetch a file from storage.
  """
  directive @signedUrl on FIELD_DEFINITION
`

const transform: TransformerDirectiveFunc = async ({ resolvedValue }) => {
  if (
    !resolvedValue ||
    typeof resolvedValue !== 'string' ||
    resolvedValue.length === 0
  ) {
    return null
  }
  const signedUrl = await storage.getSignedUrl(resolvedValue)
  return signedUrl
}

const signedUrl = createTransformerDirective(schema, transform)

export default signedUrl
