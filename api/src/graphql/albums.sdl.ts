export const schema = gql`
  type Album {
    id: ID!
    name: String!
    pics: [Pic]!
    picCount: Int!
  }

  type Albums {
    albums: [Album!]!
    albumCount: Int!
  }

  type Query {
    albums: Albums! @requireAuth
    album(id: ID!): Album @requireAuth
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
    updateAlbum(id: ID!, input: UpdateAlbumInput!): Album! @blocked
    deleteAlbum(id: ID!): Album! @blocked
  }
`
