import type { GraphQLResolveInfo } from "graphql";

import type { RedwoodGraphQLContext } from "@redwoodjs/graphql-server/dist/types";

import type { Pic as RTPic } from "./shared-return-types";
import type { OnBackgroundRemovedInput, OnTagsCreatedInput, Mutation } from "./shared-schema-types";

/** SDL: onBackgroundRemoved(input: OnBackgroundRemovedInput!): Pic! */
export interface OnBackgroundRemovedResolver {
    (args: {input: OnBackgroundRemovedInput}, obj: { root: Mutation, context: RedwoodGraphQLContext, info: GraphQLResolveInfo }): Promise<RTPic>;
}

/** SDL: onTagsCreated(input: OnTagsCreatedInput!): Pic! */
export interface OnTagsCreatedResolver {
    (args: {input: OnTagsCreatedInput}, obj: { root: Mutation, context: RedwoodGraphQLContext, info: GraphQLResolveInfo }): Promise<RTPic>;
}
