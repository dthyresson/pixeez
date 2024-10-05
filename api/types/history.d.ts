import type { GraphQLResolveInfo } from "graphql";

import type { RedwoodGraphQLContext } from "@redwoodjs/graphql-server/dist/types";

import type { History as RTHistory, JobCount as RTJobCount } from "./shared-return-types";
import type { Query } from "./shared-schema-types";

/** SDL: histories(jobName: String): [History!]! */
export interface HistoriesResolver {
    (args: {jobName?: string }, obj?: { root: Query, context: RedwoodGraphQLContext, info: GraphQLResolveInfo }): Promise<RTHistory[]>;
}

/** SDL: jobCount: [JobCount!]! */
export interface JobCountResolver {
    (args?: object, obj?: { root: Query, context: RedwoodGraphQLContext, info: GraphQLResolveInfo }): Promise<RTJobCount[]>;
}
