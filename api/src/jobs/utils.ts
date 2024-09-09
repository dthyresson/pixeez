import { jobs } from 'src/lib/jobs'

export const executeGraphQLQuery = async ({
  query,
  inputVariables,
}: {
  query: string
  inputVariables: Record<string, string>
}) => {
  jobs.logger.debug({ query, inputVariables }, '>>>>>> Executing GraphQL query')

  const response = await fetch(process.env.GRAPHQL_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      query,
      variables: {
        input: {
          ...inputVariables,
          secret: process.env.WEBHOOK_SECRET,
        },
      },
    }),
  })

  if (!response.ok) {
    jobs.logger.error({ response }, 'GraphQL query failed')
    throw new Error('GraphQL query failed')
  }

  jobs.logger.debug({ status: response.status }, 'GraphQL query done')

  return
}
