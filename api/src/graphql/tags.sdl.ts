export const schema = gql`
  type Tag {
    id: String!
    createdAt: DateTime!
    updatedAt: DateTime!
    name: String!
    pics: [Pic]!
  }

  type Query {
    tags: [Tag!]! @requireAuth
    tag(id: String!): Tag @requireAuth
  }

  input CreateTagInput {
    name: String!
  }

  input UpdateTagInput {
    name: String
  }

  type Mutation {
    createTag(input: CreateTagInput!): Tag! @blocked
    updateTag(id: String!, input: UpdateTagInput!): Tag! @blocked
    deleteTag(id: String!): Tag! @blocked
  }
`
