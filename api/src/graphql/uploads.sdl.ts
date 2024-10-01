export const schema = gql`
  type UploadToken {
    token: String!
  }

  type Query {
    getUploadToken(operationName: String!): UploadToken!
      @rateLimited(identifier: "getUploadToken")
      @skipAuth
  }
`
