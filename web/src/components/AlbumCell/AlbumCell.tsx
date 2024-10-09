import type {
  FindAlbumQuery,
  FindAlbumQueryVariables,
  Pic,
  Album,
} from 'types/graphql'

import {
  useUploadsMutation,
  UploadFilesComponent,
} from '@redwoodjs/uploads-web'
import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'
import { Metadata } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { EmptyState } from 'src/components/CellStates/EmptyState'
import { FailureState } from 'src/components/CellStates/FailureState'
import { LoadingState } from 'src/components/CellStates/LoadingState'
import { PicsGrid } from 'src/components/Pics/PicsGrid'
import { PreviewArea } from 'src/components/PreviewArea/PreviewArea'

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
  const [createPics] = useUploadsMutation(CREATE_PICS_MUTATION, {
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
        <div className="m-8 rounded-lg border-2 border-dashed border-pink-300 p-8 text-center">
          <UploadFilesComponent
            maxFiles={20}
            onFileAccepted={handleFileAccepted}
            SelectFilesButton={({ onClick }) => (
              <div className="mb-2 mt-8 flex items-center justify-center gap-2">
                <button
                  onClick={onClick}
                  className="flex items-center justify-center gap-2 rounded-md bg-teal-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-teal-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  🖼️ Pick Pics
                </button>
              </div>
            )}
            toast={toast}
            showPreviews={false}
            previews={(files, removeFile) => (
              <PreviewArea files={files} removeFile={removeFile} />
            )}
          >
            {album.pics.length > 0 && <PicsGrid pics={album.pics as Pic[]} />}
          </UploadFilesComponent>
        </div>
      </div>
    </>
  )
}
