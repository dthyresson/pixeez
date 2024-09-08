import type { GraphQLResolveInfo } from "graphql";

import type { RedwoodGraphQLContext } from "@redwoodjs/graphql-server/dist/types";

import type { Tag as RTTag } from "./shared-return-types";
import type { CreateTagInput, UpdateTagInput, Query, Mutation } from "./shared-schema-types";

/** SDL: tags: [Tag!]! */
export interface TagsResolver {
    (args?: object, obj?: { root: Query, context: RedwoodGraphQLContext, info: GraphQLResolveInfo }): Promise<RTTag[]>;
}

/** SDL: tag(id: String!): Tag */
export interface TagResolver {
    (args: {id: string}, obj?: { root: Query, context: RedwoodGraphQLContext, info: GraphQLResolveInfo }): Promise<RTTag| null>;
}

/** SDL: createTag(input: CreateTagInput!): Tag! */
export interface CreateTagResolver {
    (args: {input: CreateTagInput}, obj?: { root: Mutation, context: RedwoodGraphQLContext, info: GraphQLResolveInfo }): Promise<RTTag>;
}

/** SDL: updateTag(id: String!, input: UpdateTagInput!): Tag! */
export interface UpdateTagResolver {
    (args: {id: string, input: UpdateTagInput}, obj?: { root: Mutation, context: RedwoodGraphQLContext, info: GraphQLResolveInfo }): Promise<RTTag>;
}

/** SDL: deleteTag(id: String!): Tag! */
export interface DeleteTagResolver {
    (args: {id: string}, obj?: { root: Mutation, context: RedwoodGraphQLContext, info: GraphQLResolveInfo }): Promise<RTTag>;
}
