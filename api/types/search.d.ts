import type { GraphQLResolveInfo } from "graphql";

import type { RedwoodGraphQLContext } from "@redwoodjs/graphql-server/dist/types";

import type { PaginatedPics as RTPaginatedPics } from "./shared-return-types";
import type { Query } from "./shared-schema-types";

/** SDL: search(limit: Int, page: Int, query: String): PaginatedPics */
export interface SearchResolver {
    (args: {limit?: number , page?: number , query?: string }, obj?: { root: Query, context: RedwoodGraphQLContext, info: GraphQLResolveInfo }): Promise<RTPaginatedPics| null>;
}
