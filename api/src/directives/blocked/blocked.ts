import {
  AuthenticationError,
  createValidatorDirective,
  ValidatorDirectiveFunc,
} from '@redwoodjs/graphql-server'

import { logger } from 'src/lib/logger'

export const schema = gql`
  """
  Use @blocked to validate access to a field, query or mutation.
  """
  directive @blocked on FIELD_DEFINITION
`

const validate: ValidatorDirectiveFunc = ({ directiveArgs }) => {
  logger.warn(
    {
      directiveArgs,
    },
    'Blocked directive called'
  )

  throw new AuthenticationError(
    'You are not authorized to access this resource'
  )
}

const blocked = createValidatorDirective(schema, validate)

export default blocked
