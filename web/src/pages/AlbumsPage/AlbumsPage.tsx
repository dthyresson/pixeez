import { Metadata } from '@redwoodjs/web'

import AlbumsCell from 'src/components/AlbumsCell'

const AlbumsPage = () => {
  return (
    <>
      <Metadata title="Albums" description="Albums page" />

      <h1 className="mb-4 text-xl font-bold text-purple-600">Albums</h1>
      <AlbumsCell />
    </>
  )
}

export default AlbumsPage
