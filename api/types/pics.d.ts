import type { GraphQLResolveInfo } from "graphql";

import type { RedwoodGraphQLContext } from "@redwoodjs/graphql-server/dist/types";

import type { Pic as RTPic } from "./shared-return-types";
import type { CreatePicInput, CreatePicsInput, UpdatePicInput, Query, Mutation } from "./shared-schema-types";

/** SDL: pics: [Pic!]! */
export interface PicsResolver {
    (args?: object, obj?: { root: Query, context: RedwoodGraphQLContext, info: GraphQLResolveInfo }): Promise<RTPic[]>;
}

/** SDL: pic(id: ID!): Pic */
export interface PicResolver {
    (args: {id: ID}, obj?: { root: Query, context: RedwoodGraphQLContext, info: GraphQLResolveInfo }): Promise<RTPic| null>;
}

/** SDL: createPic(input: CreatePicInput!): Pic! */
export interface CreatePicResolver {
    (args: {input: CreatePicInput}, obj?: { root: Mutation, context: RedwoodGraphQLContext, info: GraphQLResolveInfo }): Promise<RTPic>;
}

/** SDL: createPics(input: CreatePicsInput!): [Pic!]! */
export interface CreatePicsResolver {
    (args: {input: CreatePicsInput}, obj?: { root: Mutation, context: RedwoodGraphQLContext, info: GraphQLResolveInfo }): Promise<RTPic[]>;
}

/** SDL: updatePic(id: ID!, input: UpdatePicInput!): Pic! */
export interface UpdatePicResolver {
    (args: {id: ID, input: UpdatePicInput}, obj?: { root: Mutation, context: RedwoodGraphQLContext, info: GraphQLResolveInfo }): Promise<RTPic>;
}

/** SDL: deletePic(id: ID!): Pic! */
export interface DeletePicResolver {
    (args: {id: ID}, obj?: { root: Mutation, context: RedwoodGraphQLContext, info: GraphQLResolveInfo }): Promise<RTPic>;
}

type ID = any;
