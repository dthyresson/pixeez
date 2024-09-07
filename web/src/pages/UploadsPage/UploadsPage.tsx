import { useCallback, useState } from 'react'

import { useDropzone } from 'react-dropzone'
import type {
  GetAlbumsForSelectListQuery,
  GetAlbumsForSelectListQueryVariables,
  CreatePicsMutation,
  CreatePicsMutationVariables,
} from 'types/graphql'
import type { CreatePicsInput } from 'types/graphql'

import { Form, Label, SelectField } from '@redwoodjs/forms'
import { navigate, routes } from '@redwoodjs/router'
import { useMutation, useQuery, TypedDocumentNode } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

const GET_ALBUMS_QUERY: TypedDocumentNode<
  GetAlbumsForSelectListQuery,
  GetAlbumsForSelectListQueryVariables
> = gql`
  query GetAlbumsForSelectListQuery {
    albums {
      id
      name
    }
  }
`

const CREATE_PICS_MUTATION: TypedDocumentNode<
  CreatePicsMutation,
  CreatePicsMutationVariables
> = gql`
  mutation CreatePicsMutation($input: CreatePicsInput!) {
    createPics(input: $input) {
      id
      original
      processed
      albumId
    }
  }
`

const PicsForm = ({ onSubmit, loading, error }) => {
  const { data, loading: albumsLoading } = useQuery<
    GetAlbumsForSelectListQuery,
    GetAlbumsForSelectListQueryVariables
  >(GET_ALBUMS_QUERY)
  const albums = data?.albums || []

  const [files, setFiles] = useState([])
  const [selectedAlbumId, setSelectedAlbumId] = useState('')

  const handleSubmit = useCallback(
    (formData, droppedFiles = null) => {
      onSubmit({
        ...formData,
        originals: droppedFiles || files,
      })
    },
    [onSubmit, files]
  )

  const onDrop = useCallback(
    (acceptedFiles) => {
      setFiles(acceptedFiles)
      handleSubmit({ albumId: selectedAlbumId }, acceptedFiles)
    },
    [selectedAlbumId, handleSubmit]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  if (loading) return <div>Loading...</div>
  if (albumsLoading) return <div>Loading albums...</div>

  return (
    <Form
      onSubmit={handleSubmit}
      error={error}
      className="mx-auto mt-8 max-w-2xl rounded-lg bg-white p-6 shadow-md"
    >
      <div className="mb-4">
        <Label
          name="albumId"
          className="mb-2 block text-sm font-bold text-gray-700"
        >
          Album
        </Label>
        <SelectField
          name="albumId"
          className="w-full rounded-lg border px-3 py-2 text-gray-700 focus:border-blue-500 focus:outline-none"
          onChange={(e) => setSelectedAlbumId(e.target.value)}
          value={selectedAlbumId}
        >
          <option value="">Select an album</option>
          {albums.map((album) => (
            <option key={album.id} value={album.id}>
              {album.name}
            </option>
          ))}
        </SelectField>
      </div>
      <div className="mb-4">
        <Label
          name="originals"
          className="mb-2 block text-sm font-bold text-gray-700"
        >
          Pics
        </Label>
        <div
          {...getRootProps()}
          className="w-full rounded-lg border-2 border-dashed border-gray-300 p-6 text-center"
        >
          <input {...getInputProps()} name="originals" />
          {isDragActive ? (
            <p>Drop your pics here ...</p>
          ) : (
            <p>
              Drag &apos;n&apos; drop your pics here, or click to select some
              pics
            </p>
          )}
        </div>
        {files.length > 0 && (
          <div className="mt-2">
            <p>Selected files:</p>
            <ul>
              {files.map((file) => (
                <li key={file.name}>{file.name}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Form>
  )
}

const UploadsPage = () => {
  const [createPics, { loading, error }] = useMutation(CREATE_PICS_MUTATION, {
    onCompleted: (data) => {
      console.log(data)
      toast.success('Pics uploaded successfully')
      navigate(routes.album({ id: data.createPics[0].albumId }))
    },
  })

  const onSubmit = (formData: CreatePicsInput) => {
    const albumId = parseInt(formData.albumId.toString())
    createPics({
      variables: {
        input: {
          albumId,
          originals: formData.originals,
        },
      },
    })
  }

  return (
    <>
      <PicsForm onSubmit={onSubmit} loading={loading} error={error} />
    </>
  )
}

export default UploadsPage
