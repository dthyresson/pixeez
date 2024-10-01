import {
  createTransformerDirective,
  TransformerDirectiveFunc,
} from '@redwoodjs/graphql-server'

import { getBase64DataUri } from 'src/lib/images'
import { logger } from 'src/lib/logger'
export const schema = gql`
  """
  Use @dataUri to transform the resolved value to return a modified result.
  """
  directive @dataUri on FIELD_DEFINITION
`

const transform: TransformerDirectiveFunc = ({
  //context,
  resolvedValue,
  args,
  directiveArgs,
}) => {
  logger.debug(
    { args, directiveArgs },
    'args and directiveArgs in dataUri directive'
  )
  // ... you can modify the resolvedValue and return it
  logger.debug(resolvedValue, 'resolvedValue in dataUri directive')

  return resolvedValue ? getBase64DataUri(resolvedValue) : null
}

const dataUri = createTransformerDirective(schema, transform)

export default dataUri
