import {
  createTransformerDirective,
  TransformerDirectiveFunc,
} from '@redwoodjs/graphql-server'

import { getBase64DataUri } from 'src/lib/images'
export const schema = gql`
  """
  Use @dataUri to transform the resolved value to return a modified result.
  """
  directive @dataUri on FIELD_DEFINITION
`

const transform: TransformerDirectiveFunc = ({
  //context,
  resolvedValue,
}) => {
  return resolvedValue ? getBase64DataUri(resolvedValue) : null
}

const dataUri = createTransformerDirective(schema, transform)

export default dataUri
