export const schema = gql`
  type Pic {
    id: String!
    createdAt: DateTime!
    updatedAt: DateTime!
    album: Album!
    albumId: String!
    original: String!
    withoutBackground: String
    width: Int
    height: Int
    format: String
    exif: String
    description: String
    tags: [Tag!]!
  }

  type Query {
    pics: [Pic!]! @requireAuth
    pic(id: String!): Pic @requireAuth
  }

  input CreatePicInput {
    albumId: String!
    original: File!
  }

  input CreatePicsInput {
    albumId: String!
    originals: [File!]!
  }

  input UpdatePicInput {
    albumId: String
    original: File
  }

  type Mutation {
    createPic(input: CreatePicInput!): Pic!
      @rateLimited(identifier: "createPic")
    createPics(input: CreatePicsInput!): [Pic!]!
      @rateLimited(identifier: "createPics")
    updatePic(id: String!, input: UpdatePicInput!): Pic! @blocked
    deletePic(id: String!): Pic! @blocked
  }
`
