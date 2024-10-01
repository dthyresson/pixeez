import type { GraphQLResolveInfo } from "graphql";

import type { RedwoodGraphQLContext } from "@redwoodjs/graphql-server/dist/types";

import type { RedwoodUploadToken as RTRedwoodUploadToken } from "./shared-return-types";
import type { Query } from "./shared-schema-types";

/** SDL: getRedwoodUploadToken(operationName: String!): RedwoodUploadToken! */
export interface GetRedwoodUploadTokenResolver {
    (args: {operationName: string}, obj?: { root: Query, context: RedwoodGraphQLContext, info: GraphQLResolveInfo }): Promise<RTRedwoodUploadToken>;
}
