import { useState } from 'react'

import type {
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

export const QUERY: TypedDocumentNode<
  FindAlbumsQuery,
  FindAlbumsQueryVariables
> = gql`
  query FindAlbumsQuery {
    albums {
      id
      name
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
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({ error }: CellFailureProps) => (
  <div style={{ color: 'red' }}>Error: {error?.message}</div>
)

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
    <form onSubmit={handleSubmit} className="mb-4">
      <input
        type="text"
        value={newAlbumName}
        onChange={(e) => setNewAlbumName(e.target.value)}
        placeholder="New album name"
        className="mr-2 rounded-md border p-2 dark:bg-gray-700 dark:text-white"
      />
      <button
        type="submit"
        className="rounded-md bg-purple-700 px-4 py-2 text-white hover:bg-purple-500 dark:text-white"
      >
        🆕&nbsp;Create Album
      </button>
      {error && <p className="mt-2 text-red-500">{error}</p>}
    </form>
  )
}

export const Success = ({ albums }: CellSuccessProps<FindAlbumsQuery>) => {
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

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {albums.map((item) => (
          <div
            key={item.id}
            className="rounded-lg bg-purple-700 p-4 text-white shadow-md hover:bg-purple-600"
          >
            <Link to={routes.album({ id: item.id })}>
              <p className="text-center font-semibold dark:text-white">
                📚&nbsp;{item.name}
              </p>
            </Link>
          </div>
        ))}
      </div>
      <div className="flex justify-start lg:justify-center">
        <CreateAlbumForm onSubmit={handleCreateAlbum} error={error} />
      </div>
    </div>
  )
}
