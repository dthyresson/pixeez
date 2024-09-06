import { AuthenticationError } from '@redwoodjs/graphql-server'
import {
  createValidatorDirective,
  ValidatorDirectiveFunc,
} from '@redwoodjs/graphql-server'

import { logger } from 'src/lib/logger'
import { Ratelimiter } from 'src/lib/unkey'

export const schema = gql`
  """
  Use @rateLimited to validate access to a field, query or mutation.
  """
  directive @rateLimited(identifier: String!) on FIELD_DEFINITION
`

const validate: ValidatorDirectiveFunc = async ({ directiveArgs }) => {
  const limit = await Ratelimiter.limit(directiveArgs.identifier)
  if (!limit.success) {
    logger.warn(
      {
        identifier: directiveArgs.identifier,
        limit,
      },
      'Rate limit exceeded'
    )
    throw new AuthenticationError('Too busy. Try again later.')
  }

  return
}

const rateLimited = createValidatorDirective(schema, validate)

export default rateLimited
