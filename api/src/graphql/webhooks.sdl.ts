export const schema = gql`
  input OnBackgroundRemovedInput {
    id: ID!
    secret: String!
  }

  input OnTagsCreatedInput {
    id: ID!
    secret: String!
  }

  type Mutation {
    onBackgroundRemoved(input: OnBackgroundRemovedInput!): Pic!
      @rateLimited(identifier: "onBackgroundRemoved")
    onTagsCreated(input: OnTagsCreatedInput!): Pic!
      @rateLimited(identifier: "onTagsCreated")
  }
`
