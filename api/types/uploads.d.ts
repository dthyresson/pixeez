import type { GraphQLResolveInfo } from "graphql";

import type { RedwoodGraphQLContext } from "@redwoodjs/graphql-server/dist/types";

import type { UploadToken as RTUploadToken } from "./shared-return-types";
import type { Query } from "./shared-schema-types";

/** SDL: getUploadToken(operationName: String!): UploadToken! */
export interface GetUploadTokenResolver {
    (args: {operationName: string}, obj?: { root: Query, context: RedwoodGraphQLContext, info: GraphQLResolveInfo }): Promise<RTUploadToken>;
}
