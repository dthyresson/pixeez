export const schema = gql`
  type Tag {
    id: ID!
    createdAt: DateTime!
    updatedAt: DateTime!
    name: String!
    pics: [Pic]!
  }

  type Query {
    tags: [Tag!]! @requireAuth
    tag(id: ID!): Tag @requireAuth
  }

  input CreateTagInput {
    name: String!
  }

  input UpdateTagInput {
    name: String
  }

  type Mutation {
    createTag(input: CreateTagInput!): Tag! @blocked
    updateTag(id: ID!, input: UpdateTagInput!): Tag! @blocked
    deleteTag(id: ID!): Tag! @blocked
  }
`
