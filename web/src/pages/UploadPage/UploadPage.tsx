import type { CreatePicInput } from 'types/graphql'

import { FileField, Form, Label, Submit, SelectField } from '@redwoodjs/forms'
import { navigate, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

const CREATE_PIC_MUTATION = gql`
  mutation CreatePicMutation($input: CreatePicInput!) {
    createPic(input: $input) {
      id
      original
      processed
    }
  }
`

const PicForm = ({ onSubmit, loading, error }) => {
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
          name="original"
          className="mb-2 block text-sm font-bold text-gray-700"
        >
          Original Pic
        </Label>
        <FileField
          name="original"
          className="w-full rounded-lg border px-3 py-2 text-gray-700 focus:border-blue-500 focus:outline-none"
        />
      </div>
      <Submit className="focus:shadow-outline w-full rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none">
        Upload
      </Submit>
    </Form>
  )
}

const UploadPage = () => {
  const [createPic, { loading, error }] = useMutation(CREATE_PIC_MUTATION, {
    onCompleted: (data) => {
      console.log(data)
      toast.success('Pic uploaded successfully')
      navigate(routes.pics())
    },
  })

  const onSubmit = (formData: CreatePicInput) => {
    console.log(formData)
    // convert albumId to int
    const albumId = parseInt(formData.albumId.toString())
    const input = {
      ...formData,
      albumId,
      original: formData.original?.[0],
    }
    createPic({ variables: { input } })
  }

  return (
    <>
      <PicForm onSubmit={onSubmit} loading={loading} error={error} />
    </>
  )
}

export default UploadPage
