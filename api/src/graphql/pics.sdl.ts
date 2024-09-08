export const schema = gql`
  type Pic {
    id: Int!
    album: Album!
    albumId: Int!
    original: String!
    processed: String
    width: Int
    height: Int
    format: String
    exif: String
    description: String
    tags: [Tag!]!
  }

  type Query {
    pics: [Pic!]! @requireAuth
    pic(id: Int!): Pic @requireAuth
  }

  input CreatePicInput {
    albumId: Int!
    original: File!
  }

  input CreatePicsInput {
    albumId: Int!
    originals: [File!]!
  }

  input UpdatePicInput {
    albumId: Int
    original: File
  }

  type Mutation {
    createPic(input: CreatePicInput!): Pic! @requireAuth
    createPics(input: CreatePicsInput!): [Pic!]! @requireAuth
    updatePic(id: Int!, input: UpdatePicInput!): Pic! @requireAuth
    deletePic(id: Int!): Pic! @requireAuth
  }
`
