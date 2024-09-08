export const schema = gql`
  type Pic {
    id: Int!
    createdAt: DateTime!
    updatedAt: DateTime!
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
    createPic(input: CreatePicInput!): Pic!
      @rateLimited(identifier: "createPic")
    createPics(input: CreatePicsInput!): [Pic!]!
      @rateLimited(identifier: "createPics")
    updatePic(id: Int!, input: UpdatePicInput!): Pic! @blocked
    deletePic(id: Int!): Pic! @blocked
  }
`
