import type { GraphQLResolveInfo } from "graphql";

import type { RedwoodGraphQLContext } from "@redwoodjs/graphql-server/dist/types";

import type { Album as RTAlbum } from "./shared-return-types";
import type { CreateAlbumInput, UpdateAlbumInput, Query, Mutation } from "./shared-schema-types";

/** SDL: albums: [Album!]! */
export interface AlbumsResolver {
    (args?: object, obj?: { root: Query, context: RedwoodGraphQLContext, info: GraphQLResolveInfo }): Promise<RTAlbum[]>;
}

/** SDL: album(id: Int!): Album */
export interface AlbumResolver {
    (args: {id: number}, obj?: { root: Query, context: RedwoodGraphQLContext, info: GraphQLResolveInfo }): Promise<RTAlbum| null>;
}

/** SDL: createAlbum(input: CreateAlbumInput!): Album! */
export interface CreateAlbumResolver {
    (args: {input: CreateAlbumInput}, obj: { root: Mutation, context: RedwoodGraphQLContext, info: GraphQLResolveInfo }): Promise<RTAlbum>;
}

/** SDL: updateAlbum(id: Int!, input: UpdateAlbumInput!): Album! */
export interface UpdateAlbumResolver {
    (args: {id: number, input: UpdateAlbumInput}, obj?: { root: Mutation, context: RedwoodGraphQLContext, info: GraphQLResolveInfo }): Promise<RTAlbum>;
}

/** SDL: deleteAlbum(id: Int!): Album! */
export interface DeleteAlbumResolver {
    (args: {id: number}, obj?: { root: Mutation, context: RedwoodGraphQLContext, info: GraphQLResolveInfo }): Promise<RTAlbum>;
}
