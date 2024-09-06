export const schema = gql`
  type Pic {
    id: String!
    album: Album!
    albumId: String!
    original: String!
    processed: String!
  }

  type Query {
    pics: [Pic!]! @requireAuth
    pic(id: String!): Pic @requireAuth
  }

  input CreatePicInput {
    albumId: String!
    original: String!
    processed: String!
  }

  input UpdatePicInput {
    albumId: String
    original: String
    processed: String
  }

  type Mutation {
    createPic(input: CreatePicInput!): Pic! @requireAuth
    updatePic(id: String!, input: UpdatePicInput!): Pic! @requireAuth
    deletePic(id: String!): Pic! @requireAuth
  }
`
