import { useQuery, useMutation } from '@redwoodjs/web'

// Define the query to get the upload token
const GET_UPLOAD_TOKEN = gql`
  query GetUploadToken($operationName: String!) {
    getUploadToken(operationName: $operationName) {
      token
    }
  }
`

const useUploadMutation = (mutation, options = {}) => {
  // Extract the mutation name from the mutation document
  const mutationName = mutation.definitions[0]?.name?.value

  // Use the getUploadToken query to get the JWT token
  const {
    data,
    //loading, error
  } = useQuery(GET_UPLOAD_TOKEN, {
    variables: { operationName: mutationName },
    skip: !mutationName, // Skip the query if the mutation name is not available
  })

  // Retrieve the token
  const token = data?.getUploadToken?.token

  // Customize the useMutation hook to include the upload token in the headers
  const [mutate] = useMutation(mutation, {
    ...options,
    context: {
      headers: {
        ...options?.['context']?.headers,
        'x-presigned-url': token, // Set the token in the headers
      },
    },
  })

  return [mutate]
}

export default useUploadMutation
