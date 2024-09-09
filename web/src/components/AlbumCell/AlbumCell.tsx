import { useCallback } from 'react'

import { useDropzone } from 'react-dropzone'
import type {
  FindAlbumQuery,
  FindAlbumQueryVariables,
  Pic,
  Album,
} from 'types/graphql'

import { Metadata } from '@redwoodjs/web'
import { useMutation } from '@redwoodjs/web'
import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { EmptyState } from 'src/components/CellStates/EmptyState'
import { FailureState } from 'src/components/CellStates/FailureState'
import { LoadingState } from 'src/components/CellStates/LoadingState'
import { PicsGrid } from 'src/components/Pics/PicsGrid'

const CREATE_PICS_MUTATION = gql`
  mutation CreatePicsMutation($input: CreatePicsInput!) {
    createPics(input: $input) {
      id
      original
      withoutBackground
      albumId
    }
  }
`

const MAX_FILES = 20

export const beforeQuery = (props: FindAlbumQueryVariables) => {
  return {
    variables: props,
  }
}

export const QUERY: TypedDocumentNode<FindAlbumQuery, FindAlbumQueryVariables> =
  gql`
    query FindAlbumQuery($id: ID!) @live {
      album: album(id: $id) {
        id
        name
        pics {
          id
          original
          withoutBackground
          album {
            id
            name
          }
        }
        picCount
      }
    }
  `

export const Empty = () => <EmptyState />

export const Loading = () => <LoadingState />

export const Failure = ({
  error,
}: CellFailureProps<FindAlbumQueryVariables>) => <FailureState error={error} />

export const Success = ({
  album,
}: CellSuccessProps<FindAlbumQuery, FindAlbumQueryVariables>) => {
  const [createPics] = useMutation(CREATE_PICS_MUTATION, {
    onCompleted: () => {
      toast.success('Background removal in progress...', {
        duration: 2_500,
      })
    },
    refetchQueries: [{ query: QUERY, variables: { id: album.id } }],
  })

  const onDrop = useCallback(
    (acceptedFiles, rejectedFiles) => {
      if (rejectedFiles.length > 0) {
        // Handle rejected files
        if (rejectedFiles.length > MAX_FILES) {
          toast.error(`You can only upload up to ${MAX_FILES} files at a time`)
        } else {
          const nonImageFiles = rejectedFiles.filter(
            (file) => !file.file.type.startsWith('image/')
          )
          if (nonImageFiles.length > 0) {
            toast.error('Only image files are allowed')
          }
        }
        return // Exit the function if there are rejected files
      }

      // Proceed with the mutation only if there are no rejected files
      createPics({
        variables: {
          input: {
            albumId: album.id,
            originals: acceptedFiles,
          },
        },
      })
    },
    [album.id, createPics]
  )

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
    },
    maxFiles: MAX_FILES,
    noClick: true, // Prevent opening dialog on click of the entire dropzone area
  })

  const picCountLabel = (album: Album) => {
    return album.picCount === 1 ? '1 pic' : `${album.picCount} pics`
  }

  return (
    <>
      <Metadata
        title={`${album.name} Album`}
        description={`${album.name} Album`}
      />

      <div>
        <h2 className="mb-4 text-xl font-bold">
          {album.name} Album{' '}
          <span className="text-sm text-purple-500">
            {picCountLabel(album as Album)}
          </span>
        </h2>
        {album.pics.length === 0 ? (
          <div
            {...getRootProps()}
            className="mb-4 rounded-lg border-2 border-dashed border-purple-300 p-4 text-center"
          >
            <input {...getInputProps()} />
            {isDragActive ? (
              <p>Drop your 🖼️ images here ...</p>
            ) : (
              <p>Drag &apos;n&apos; drop some 🖼️ pics here</p>
            )}
          </div>
        ) : (
          <div {...getRootProps()}>
            <input {...getInputProps()} />
            <PicsGrid pics={album.pics as Pic[]} />
          </div>
        )}
      </div>
      <div className="mt-4 flex justify-start lg:justify-center">
        <p className="text-sm text-gray-500">
          You can{' '}
          <button
            className="font-inherit mx-1 cursor-pointer border-none bg-transparent p-0 text-purple-500 hover:underline"
            onClick={open}
          >
            upload
          </button>{' '}
          pics to your {album.name} album ... or drag &apos;n&apos; drop above
        </p>
      </div>
    </>
  )
}
