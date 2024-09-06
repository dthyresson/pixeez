import type { GraphQLResolveInfo } from "graphql";

import type { RedwoodGraphQLContext } from "@redwoodjs/graphql-server/dist/types";

import type { Pic as RTPic } from "./shared-return-types";
import type { CreatePicInput, UpdatePicInput, Query, Mutation } from "./shared-schema-types";

/** SDL: pics: [Pic!]! */
export interface PicsResolver {
    (args?: object, obj?: { root: Query, context: RedwoodGraphQLContext, info: GraphQLResolveInfo }): Promise<RTPic[]>;
}

/** SDL: pic(id: Int!): Pic */
export interface PicResolver {
    (args: {id: number}, obj?: { root: Query, context: RedwoodGraphQLContext, info: GraphQLResolveInfo }): Promise<RTPic| null>;
}

/** SDL: createPic(input: CreatePicInput!): Pic! */
export interface CreatePicResolver {
    (args: {input: CreatePicInput}, obj?: { root: Mutation, context: RedwoodGraphQLContext, info: GraphQLResolveInfo }): Promise<RTPic>;
}

/** SDL: updatePic(id: Int!, input: UpdatePicInput!): Pic! */
export interface UpdatePicResolver {
    (args: {id: number, input: UpdatePicInput}, obj?: { root: Mutation, context: RedwoodGraphQLContext, info: GraphQLResolveInfo }): Promise<RTPic>;
}

/** SDL: deletePic(id: Int!): Pic! */
export interface DeletePicResolver {
    (args: {id: number}, obj?: { root: Mutation, context: RedwoodGraphQLContext, info: GraphQLResolveInfo }): Promise<RTPic>;
}
