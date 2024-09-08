export const schema = gql`
  interface PaginatedItems {
    count: Int!
    page: Int!
    limit: Int!
  }

  type PaginatedPics implements PaginatedItems {
    items: [Pic]
    count: Int!
    page: Int!
    limit: Int!
  }

  type Query {
    search(query: String, page: Int, limit: Int): PaginatedPics
      @rateLimited(identifier: "search")
  }
`
