import { Metadata } from '@redwoodjs/web'

import AlbumsCell from 'src/components/AlbumsCell'

const AlbumsPage = () => {
  return (
    <>
      <Metadata title="Albums" description="Albums" />

      <AlbumsCell />
    </>
  )
}

export default AlbumsPage
