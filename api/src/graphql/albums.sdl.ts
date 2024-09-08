export const schema = gql`
  type Album {
    id: Int!
    name: String!
    pics: [Pic]!
  }

  type Query {
    albums: [Album!]! @requireAuth
    album(id: Int!): Album @requireAuth
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
    updateAlbum(id: Int!, input: UpdateAlbumInput!): Album! @blocked
    deleteAlbum(id: Int!): Album! @blocked
  }
`
