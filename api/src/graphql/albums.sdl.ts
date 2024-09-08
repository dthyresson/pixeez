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
    createAlbum(input: CreateAlbumInput!): Album!
      @rateLimited(identifier: "createAlbum")
    updateAlbum(id: String!, input: UpdateAlbumInput!): Album! @blocked
    deleteAlbum(id: String!): Album! @blocked
  }
`
