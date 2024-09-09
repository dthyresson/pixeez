export const schema = gql`
  input OnBackgroundRemovedInput {
    id: ID!
  }

  input OnTagsCreatedInput {
    id: ID!
  }

  type Mutation {
    onBackgroundRemoved(input: OnBackgroundRemovedInput!): Pic!
      @rateLimited(identifier: "onBackgroundRemoved")
    onTagsCreated(input: OnTagsCreatedInput!): Pic!
      @rateLimited(identifier: "onTagsCreated")
  }
`
