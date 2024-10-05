export const schema = gql`
  type History {
    id: ID!
    createdAt: DateTime!
    updatedAt: DateTime
    name: String!
    jobPicId: String!
    attempts: Int!
    queue: String!
    priority: Int!
    runAt: DateTime
    durationSeconds: Int
    lockedAt: DateTime
    lockedBy: String
    lastError: String
    picId: String!
    albumId: String!
    description: String
    format: String
    height: Int
    width: Int
    original: String @signedUrl
    thumbnail: String @signedUrl
    withoutBackground: String
    status: String
  }

  type JobCount {
    id: ID!
    name: String!
    jobCount: Int!
  }

  type Query {
    histories(jobName: String): [History!]! @skipAuth
    jobCount: [JobCount!]! @skipAuth
  }
`
