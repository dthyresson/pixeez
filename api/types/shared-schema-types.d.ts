export interface Album {
    __typename?: "Album";
    id: number;
    name: string;
    pics: Array<Pic>;
}

export interface CreateAlbumInput {
    __typename?: "CreateAlbumInput";
    name: string;
}

export interface CreatePicInput {
    __typename?: "CreatePicInput";
    albumId: number;
    original: File;
}

export interface CreatePicsInput {
    __typename?: "CreatePicsInput";
    albumId: number;
    originals: File[];
}

export interface CreateTagInput {
    __typename?: "CreateTagInput";
    name: string;
}

export interface Mutation {
    __typename?: "Mutation";
    createAlbum: Album;
    createPic: Pic;
    createPics: Pic[];
    createTag: Tag;
    deleteAlbum: Album;
    deletePic: Pic;
    deleteTag: Tag;
    updateAlbum: Album;
    updatePic: Pic;
    updateTag: Tag;
}

export interface PaginatedItems {
    __typename?: "PaginatedItems";
    count: number;
    limit: number;
    page: number;
}

export interface PaginatedPics {
    __typename?: "PaginatedPics";
    count: number;
    items?: Array<Pic| null>| null;
    limit: number;
    page: number;
}

export interface Pic {
    __typename?: "Pic";
    album: Album;
    albumId: number;
    createdAt: DateTime;
    description?: string| null;
    exif?: string| null;
    format?: string| null;
    height?: number| null;
    id: number;
    original: string;
    tags: Tag[];
    updatedAt: DateTime;
    width?: number| null;
    withoutBackground?: string| null;
}

export interface Query {
    __typename?: "Query";
    album?: Album| null;
    albums: Album[];
    pic?: Pic| null;
    pics: Pic[];
    redwood?: Redwood| null;
    search?: PaginatedPics| null;
    tag?: Tag| null;
    tags: Tag[];
}

export interface Redwood {
    __typename?: "Redwood";
    currentUser?: JSON| null;
    prismaVersion?: string| null;
    version?: string| null;
}

export interface Tag {
    __typename?: "Tag";
    createdAt: DateTime;
    id: number;
    name: string;
    pics: Array<Pic>;
    updatedAt: DateTime;
}

export interface UpdateAlbumInput {
    __typename?: "UpdateAlbumInput";
    name?: string| null;
}

export interface UpdatePicInput {
    __typename?: "UpdatePicInput";
    albumId?: number| null;
    original?: File| null;
}

export interface UpdateTagInput {
    __typename?: "UpdateTagInput";
    name?: string| null;
}

type File = any;
type DateTime = any;
type JSON = any;
