import type { GraphQLResolveInfo } from "graphql";

import type { RedwoodGraphQLContext } from "@redwoodjs/graphql-server/dist/types";

import type { Albums as RTAlbums, Album as RTAlbum } from "./shared-return-types";
import type { CreateAlbumInput, UpdateAlbumInput, Query, Mutation } from "./shared-schema-types";

/** SDL: albums: Albums! */
export interface AlbumsResolver {
    (args?: object, obj?: { root: Query, context: RedwoodGraphQLContext, info: GraphQLResolveInfo }): Promise<RTAlbums>;
}

/** SDL: album(id: ID!): Album */
export interface AlbumResolver {
    (args: {id: ID}, obj?: { root: Query, context: RedwoodGraphQLContext, info: GraphQLResolveInfo }): Promise<RTAlbum| null>;
}

/** SDL: createAlbum(input: CreateAlbumInput!): Album! */
export interface CreateAlbumResolver {
    (args: {input: CreateAlbumInput}, obj: { root: Mutation, context: RedwoodGraphQLContext, info: GraphQLResolveInfo }): Promise<RTAlbum>;
}

/** SDL: updateAlbum(id: ID!, input: UpdateAlbumInput!): Album! */
export interface UpdateAlbumResolver {
    (args: {id: ID, input: UpdateAlbumInput}, obj: { root: Mutation, context: RedwoodGraphQLContext, info: GraphQLResolveInfo }): Promise<RTAlbum>;
}

/** SDL: deleteAlbum(id: ID!): Album! */
export interface DeleteAlbumResolver {
    (args: {id: ID}, obj: { root: Mutation, context: RedwoodGraphQLContext, info: GraphQLResolveInfo }): Promise<RTAlbum>;
}

type ID = any;
