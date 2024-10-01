export const schema = gql`
  """
  Input for webhook verification
  """
  input VerifyWebhookInput {
    secret: String!
    id: ID!
  }

  input OnBackgroundRemovedInput {
    secret: String!
    id: ID!
  }

  input OnTagsCreatedInput {
    secret: String!
    id: ID!
  }

  input OnThumbnailCreatedInput {
    secret: String!
    id: ID!
  }

  type Mutation {
    onBackgroundRemoved(input: OnBackgroundRemovedInput!): Pic!
      @rateLimited(identifier: "onBackgroundRemoved")
      @verifyWebhook
    onTagsCreated(input: OnTagsCreatedInput!): Pic!
      @rateLimited(identifier: "onTagsCreated")
      @verifyWebhook
    onThumbnailCreated(input: OnThumbnailCreatedInput!): Pic!
      @rateLimited(identifier: "onThumbnailCreated")
      @verifyWebhook
  }
`
