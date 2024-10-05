export interface Album {
    __typename?: "Album";
    id: ID;
    name: string;
    picCount: number;
    pics: Array<Pic>;
}

export interface Albums {
    __typename?: "Albums";
    albumCount: number;
    albums: Album[];
}

export interface CreateAlbumInput {
    __typename?: "CreateAlbumInput";
    name: string;
}

export interface CreatePicInput {
    __typename?: "CreatePicInput";
    albumId: ID;
    original: File;
}

export interface CreatePicsInput {
    __typename?: "CreatePicsInput";
    albumId: ID;
    originals: File[];
}

export interface CreateTagInput {
    __typename?: "CreateTagInput";
    name: string;
}

export interface History {
    __typename?: "History";
    albumId: string;
    attempts: number;
    createdAt: DateTime;
    description?: string| null;
    durationSeconds?: number| null;
    format?: string| null;
    height?: number| null;
    id: ID;
    jobPicId: string;
    lastError?: string| null;
    lockedAt?: DateTime| null;
    lockedBy?: string| null;
    name: string;
    original?: string| null;
    picId: string;
    priority: number;
    queue: string;
    runAt?: DateTime| null;
    thumbnail?: string| null;
    updatedAt?: DateTime| null;
    width?: number| null;
    withoutBackground?: string| null;
}

export interface JobCount {
    __typename?: "JobCount";
    id: ID;
    jobCount: number;
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
    onBackgroundRemoved: Pic;
    onTagsCreated: Pic;
    onThumbnailCreated: Pic;
    updateAlbum: Album;
    updatePic: Pic;
    updateTag: Tag;
}

export interface OnBackgroundRemovedInput {
    __typename?: "OnBackgroundRemovedInput";
    id: ID;
    secret: string;
}

export interface OnTagsCreatedInput {
    __typename?: "OnTagsCreatedInput";
    id: ID;
    secret: string;
}

export interface OnThumbnailCreatedInput {
    __typename?: "OnThumbnailCreatedInput";
    id: ID;
    secret: string;
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
    albumId: ID;
    createdAt: DateTime;
    dataUri?: string| null;
    description?: string| null;
    exif?: string| null;
    format?: string| null;
    height?: number| null;
    id: ID;
    original: string;
    signedUrl?: string| null;
    tags: Tag[];
    thumbnail?: string| null;
    updatedAt: DateTime;
    width?: number| null;
    withoutBackground?: string| null;
}

export interface Query {
    __typename?: "Query";
    album?: Album| null;
    albums: Albums;
    getRedwoodUploadToken: RedwoodUploadToken;
    histories: History[];
    jobCount: JobCount[];
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

export interface RedwoodUploadToken {
    __typename?: "RedwoodUploadToken";
    token: string;
}

export interface Tag {
    __typename?: "Tag";
    createdAt: DateTime;
    id: ID;
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
    albumId?: ID| null;
    original?: File| null;
}

export interface UpdateTagInput {
    __typename?: "UpdateTagInput";
    name?: string| null;
}

export interface VerifyWebhookInput {
    __typename?: "VerifyWebhookInput";
    id: ID;
    secret: string;
}

type ID = any;
type File = any;
type DateTime = any;
type JSON = any;
