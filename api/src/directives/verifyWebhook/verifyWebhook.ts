import type { VerifyWebhookInput } from 'types/shared-schema-types'

import {
  createValidatorDirective,
  ValidatorDirectiveFunc,
} from '@redwoodjs/graphql-server'
import { AuthenticationError } from '@redwoodjs/graphql-server'

import { logger } from 'src/lib/logger'

export const schema = gql`
  """
  Use @verifyWebhook to validate access to a field, query or mutation.
  """
  directive @verifyWebhook on FIELD_DEFINITION
`

const validate: ValidatorDirectiveFunc = ({ args }) => {
  const { input } = args
  const { id, secret } = input as VerifyWebhookInput

  if (secret !== process.env.WEBHOOK_SECRET) {
    logger.error({ id }, 'Invalid webhook secret')
    throw new AuthenticationError('Invalid webhook secret')
  }

  logger.info({ id }, 'Webhook verified')
}

const verifyWebhook = createValidatorDirective(schema, validate)

export default verifyWebhook
