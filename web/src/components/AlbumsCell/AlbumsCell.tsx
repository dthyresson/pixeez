import { useState } from 'react'

import { PhotoIcon } from '@heroicons/react/24/solid'
import type {
  Album,
  FindAlbumsQuery,
  FindAlbumsQueryVariables,
  CreateAlbumMutation,
  CreateAlbumMutationVariables,
} from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'

import { EmptyState } from 'src/components/CellStates/EmptyState'
import { FailureState } from 'src/components/CellStates/FailureState'
import { LoadingState } from 'src/components/CellStates/LoadingState'

export const colorClasses = [
  'bg-amber-400',
  'bg-pink-400',
  'bg-teal-400',
  'bg-cyan-400',
  'bg-sky-400',
]

export const QUERY: TypedDocumentNode<
  FindAlbumsQuery,
  FindAlbumsQueryVariables
> = gql`
  query FindAlbumsQuery @live {
    albumsWithCount: albums {
      albums {
        id
        name
        picCount
      }
      albumCount
    }
  }
`

const CREATE_ALBUM_MUTATION: TypedDocumentNode<
  CreateAlbumMutation,
  CreateAlbumMutationVariables
> = gql`
  mutation CreateAlbumMutation($name: String!) {
    createAlbum(input: { name: $name }) {
      id
      name
      picCount
    }
  }
`

export const Empty = () => <EmptyState />

export const Failure = ({ error }: CellFailureProps) => (
  <FailureState error={error} />
)

export const Loading = () => <LoadingState />

const CreateAlbumForm = ({ onSubmit, error }) => {
  const [newAlbumName, setNewAlbumName] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newAlbumName.trim()) {
      onSubmit(newAlbumName.trim())
      setNewAlbumName('')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mb-4 flex items-center">
      <input
        type="text"
        value={newAlbumName}
        onChange={(e) => setNewAlbumName(e.target.value)}
        placeholder="New album name"
        className="mr-2 rounded-md border p-2 dark:bg-gray-700 dark:text-white"
      />
      <button
        type="submit"
        className="flex items-center rounded-md bg-purple-500 px-4 py-2 text-white opacity-100 hover:opacity-90 dark:text-white"
      >
        <PhotoIcon className="mr-2 h-4 w-4" />
        <span>Create Album</span>
      </button>
      {error && <p className="mt-2 text-red-500">{error}</p>}
    </form>
  )
}

export const Success = ({
  albumsWithCount,
}: CellSuccessProps<FindAlbumsQuery>) => {
  const [error, setError] = useState('')

  const [createAlbum] = useMutation(CREATE_ALBUM_MUTATION, {
    onCompleted: () => {
      setError('')
    },
    onError: (error) => {
      if (error.message.includes('Unique constraint failed')) {
        setError('An album with this name already exists')
      } else {
        setError('An error occurred while creating the album')
      }
    },
    refetchQueries: [{ query: QUERY }],
  })

  const handleCreateAlbum = (name: string) => {
    createAlbum({ variables: { name } })
  }

  const picCountLabel = (album: Album) => {
    return album.picCount === 1 ? '1 pic' : `${album.picCount} pics`
  }

  const { albums } = albumsWithCount

  return (
    <div className="space-y-8">
      <h2 className="mb-4 text-xl font-bold">
        Albums{' '}
        <span className="text-sm text-amber-500">
          {albumsWithCount.albumCount} of them
        </span>
      </h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {albums.map((album, index) => (
          <Link to={routes.album({ id: album.id })} key={album.id}>
            <div
              className={`relative rounded-lg ${colorClasses[index % colorClasses.length]} p-4 text-white opacity-90 shadow-md hover:opacity-100`}
            >
              <p className="my-4 text-center font-semibold dark:text-white">
                {album.name}
              </p>
              <p className="absolute bottom-2 right-2 text-sm text-amber-100 dark:text-amber-100">
                {picCountLabel(album as Album)}
              </p>
            </div>
          </Link>
        ))}
      </div>
      <div className="flex justify-start lg:justify-center">
        <CreateAlbumForm onSubmit={handleCreateAlbum} error={error} />
      </div>
    </div>
  )
}
