export const schema = gql`
  type Tag {
    id: Int!
    createdAt: DateTime!
    updatedAt: DateTime!
    name: String!
    pic: Pic
    picId: Int
  }

  type Query {
    tags: [Tag!]! @requireAuth
    tag(id: Int!): Tag @requireAuth
  }

  input CreateTagInput {
    name: String!
    picId: Int
  }

  input UpdateTagInput {
    name: String
    picId: Int
  }

  type Mutation {
    createTag(input: CreateTagInput!): Tag! @requireAuth
    updateTag(id: Int!, input: UpdateTagInput!): Tag! @requireAuth
    deleteTag(id: Int!): Tag! @requireAuth
  }
`
