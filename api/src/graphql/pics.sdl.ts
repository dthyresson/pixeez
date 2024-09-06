export const schema = gql`
  type Pic {
    id: Int!
    album: Album!
    albumId: Int!
    original: String!
    processed: String
  }

  type Query {
    pics: [Pic!]! @requireAuth
    pic(id: Int!): Pic @requireAuth
  }

  input CreatePicInput {
    albumId: Int!
    original: File!
  }

  input UpdatePicInput {
    albumId: Int
    original: File
  }

  type Mutation {
    createPic(input: CreatePicInput!): Pic! @requireAuth
    updatePic(id: Int!, input: UpdatePicInput!): Pic! @requireAuth
    deletePic(id: Int!): Pic! @requireAuth
  }
`
