import { useCallback, useState } from 'react'

import { useDropzone } from 'react-dropzone'
import type { CreatePicsInput } from 'types/graphql'

import { Form, Label, Submit, SelectField } from '@redwoodjs/forms'
import { navigate, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

const CREATE_PICS_MUTATION = gql`
  mutation CreatePicsMutation($input: CreatePicsInput!) {
    createPics(input: $input) {
      id
      original
      processed
    }
  }
`

const PicsForm = ({ onSubmit, loading, error }) => {
  const albums = [
    { id: 1, name: 'Family' },
    { id: 2, name: 'Work' },
  ]

  const [files, setFiles] = useState([])

  const onDrop = useCallback((acceptedFiles) => {
    setFiles(acceptedFiles)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  if (loading) return <div>Loading...</div>

  const handleSubmit = (data) => {
    onSubmit({
      albumId: data.albumId,
      originals: files,
    })
  }

  return (
    <Form
      onSubmit={handleSubmit}
      error={error}
      className="mx-auto mt-8 max-w-md rounded-lg bg-white p-6 shadow-md"
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
        >
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
          Original Pics
        </Label>
        <div
          {...getRootProps()}
          className="w-full rounded-lg border-2 border-dashed border-gray-300 p-6 text-center"
        >
          <input {...getInputProps()} name="originals" />
          {isDragActive ? (
            <p>Drop the files here ...</p>
          ) : (
            <p>
              Drag &apos;n&apos; drop some files here, or click to select files
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
      <Submit className="focus:shadow-outline w-full rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none">
        Upload
      </Submit>
    </Form>
  )
}

const UploadsPage = () => {
  const [createPics, { loading, error }] = useMutation(CREATE_PICS_MUTATION, {
    onCompleted: (data) => {
      console.log(data)
      toast.success('Pics uploaded successfully')
      navigate(routes.pics())
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
