import type {
  FindAlbumQuery,
  FindAlbumQueryVariables,
  Pic,
  Album,
} from 'types/graphql'

import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'
import { Metadata } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'
import { useUploadMutation, UploadFileComponent } from '@redwoodjs/web/upload'

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
  const [createPics] = useUploadMutation(CREATE_PICS_MUTATION, {
    onCompleted: () => {
      toast.success('Background removal in progress...', {
        duration: 2_500,
      })
    },
    onError: (error) => {
      toast.error(error.message)
    },
    refetchQueries: [{ query: QUERY, variables: { id: album.id } }],
    context: {
      headers: {
        hello: 'foo',
      },
    },
  })

  const handleFileAccepted = (acceptedFiles: File[]) => {
    createPics({
      variables: {
        input: {
          albumId: album.id,
          originals: acceptedFiles,
        },
      },
    })
  }

  const showPicCount = (album: Album) => {
    return album.picCount > 0
  }

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
          {showPicCount(album as Album) && (
            <span className="text-sm text-purple-500">
              {picCountLabel(album as Album)}
            </span>
          )}
        </h2>
        <UploadFileComponent
          className="m-8 rounded-lg border-2 border-dashed border-pink-300 p-8 text-center"
          maxFiles={20}
          onFileAccepted={handleFileAccepted}
          dropzoneContent={
            <p className="m-4 text-gray-500">
              Drag and drop some 🖼️ pics here for {album.name} album
            </p>
          }
          dropActiveContent={
            <p className="m-4 text-pink-500">Drop your 🖼️ images here ...</p>
          }
          uploadButtonContent={
            <p className="m-4 text-blue-500">Click to upload</p>
          }
          toast={toast}
        >
          {album.pics.length > 0 && <PicsGrid pics={album.pics as Pic[]} />}
        </UploadFileComponent>
      </div>
    </>
  )
}
