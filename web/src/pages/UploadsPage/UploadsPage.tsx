import type { CreatePicsInput } from 'types/graphql'

import { FileField, Form, Label, Submit, SelectField } from '@redwoodjs/forms'
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
  if (loading) return <div>Loading...</div>
  const albums = [
    { id: 1, name: 'Family' },
    { id: 2, name: 'Work' },
  ]
  return (
    <Form
      onSubmit={onSubmit}
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
        <FileField
          name="originals"
          multiple={true}
          className="w-full rounded-lg border px-3 py-2 text-gray-700 focus:border-blue-500 focus:outline-none"
        />
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
    console.log(formData)
    const albumId = parseInt(formData.albumId.toString())
    const input = {
      albumId,
      originals: formData.originals,
    }
    createPics({ variables: { input } })
  }

  return (
    <>
      <PicsForm onSubmit={onSubmit} loading={loading} error={error} />
    </>
  )
}

export default UploadsPage
