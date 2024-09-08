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

export interface Mutation {
    __typename?: "Mutation";
    createAlbum: Album;
    createPic: Pic;
    createPics: Pic[];
    deleteAlbum: Album;
    deletePic: Pic;
    updateAlbum: Album;
    updatePic: Pic;
}

export interface Pic {
    __typename?: "Pic";
    album: Album;
    albumId: number;
    description?: string| null;
    exif?: string| null;
    format?: string| null;
    height?: number| null;
    id: number;
    original: string;
    processed?: string| null;
    width?: number| null;
}

export interface Query {
    __typename?: "Query";
    album?: Album| null;
    albums: Album[];
    pic?: Pic| null;
    pics: Pic[];
    redwood?: Redwood| null;
}

export interface Redwood {
    __typename?: "Redwood";
    currentUser?: JSON| null;
    prismaVersion?: string| null;
    version?: string| null;
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

type File = any;
type JSON = any;
