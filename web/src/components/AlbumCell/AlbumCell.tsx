import { useCallback } from 'react'

import { useDropzone } from 'react-dropzone'
import type { FindAlbumQuery, FindAlbumQueryVariables } from 'types/graphql'

import { Metadata } from '@redwoodjs/web'
import { useMutation } from '@redwoodjs/web'
import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { ImageWithHover } from 'src/components/Image/ImageWithHover'

const CREATE_PICS_MUTATION = gql`
  mutation CreatePicsMutation($input: CreatePicsInput!) {
    createPics(input: $input) {
      id
      original
      processed
      albumId
    }
  }
`

export const beforeQuery = (props: FindAlbumQueryVariables) => {
  return {
    variables: props,
    pollInterval: 10_000,
  }
}

export const QUERY: TypedDocumentNode<FindAlbumQuery, FindAlbumQueryVariables> =
  gql`
    query FindAlbumQuery($id: Int!) {
      album: album(id: $id) {
        id
        name
        pics {
          id
          original
          processed
        }
      }
    }
  `

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({
  error,
}: CellFailureProps<FindAlbumQueryVariables>) => (
  <div style={{ color: 'red' }}>Error: {error?.message}</div>
)

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
    (acceptedFiles) => {
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

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  return (
    <>
      <Metadata
        title={`${album.name} Album`}
        description={`${album.name} Album`}
      />

      <div>
        <h2 className="mb-4 text-xl font-bold">{album.name} Album</h2>
        {album.pics.length === 0 ? (
          <div
            {...getRootProps()}
            className="mb-4 rounded-lg border-2 border-dashed border-gray-300 p-4 text-center"
          >
            <input {...getInputProps()} />
            {isDragActive ? (
              <p>Drop your 🖼️ images here ...</p>
            ) : (
              <p>
                Drag &apos;n&apos; drop some 🖼️ images here, or click to select
                some
              </p>
            )}
          </div>
        ) : (
          <div
            {...getRootProps()}
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
          >
            <input {...getInputProps()} />
            {album.pics.map((pic) => (
              <ImageWithHover
                key={`album-${album.id}-pic-${pic.id}`}
                pic={pic}
                albumName={album.name}
              />
            ))}
          </div>
        )}
      </div>
      <div className="mt-4 flex justify-start lg:justify-center">
        <p className="text-sm text-gray-500">
          You can upload more pics to your {album.name} album ... just drag and
          drop above
        </p>
      </div>
    </>
  )
}
