export const schema = gql`
  type Pic {
    id: ID!
    createdAt: DateTime!
    updatedAt: DateTime!
    album: Album!
    albumId: ID!
    original: String! @signedUrl
    withoutBackground: String
    thumbnail: String @signedUrl
    width: Int
    height: Int
    format: String
    exif: String
    description: String
    tags: [Tag!]!
  }

  type Query {
    pics: [Pic!]! @requireAuth
    pic(id: ID!): Pic @requireAuth
  }

  input CreatePicInput {
    albumId: ID!
    original: File!
  }

  input CreatePicsInput {
    albumId: ID!
    originals: [File!]!
  }

  input UpdatePicInput {
    albumId: ID
    original: File
  }

  type Mutation {
    createPic(input: CreatePicInput!): Pic!
      @rateLimited(identifier: "createPic")
    createPics(input: CreatePicsInput!): [Pic!]!
      @rateLimited(identifier: "createPics")
      @upload(
        input: "input"
        attributes: ["originals"]
        maxFileSize: 1000000
        maxFiles: 3
        minFiles: 1
        contentTypes: ["image/png"]
        presignedUrlHeader: "x-presigned-url"
      )
    updatePic(id: ID!, input: UpdatePicInput!): Pic! @blocked
    deletePic(id: ID!): Pic! @blocked
  }
`
