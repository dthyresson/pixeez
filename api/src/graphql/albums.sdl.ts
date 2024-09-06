export const schema = gql`
  type Album {
    id: String!
    name: String!
    pics: [Pic]!
  }

  type Query {
    albums: [Album!]! @requireAuth
    album(id: String!): Album @requireAuth
  }

  input CreateAlbumInput {
    name: String!
  }

  input UpdateAlbumInput {
    name: String
  }

  type Mutation {
    createAlbum(input: CreateAlbumInput!): Album! @requireAuth
    updateAlbum(id: String!, input: UpdateAlbumInput!): Album! @requireAuth
    deleteAlbum(id: String!): Album! @requireAuth
  }
`
