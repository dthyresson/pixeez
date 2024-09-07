import { Link, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'

import AlbumCell from 'src/components/AlbumCell'

const AlbumPage = ({ id }) => {
  return (
    <>
      <Metadata title="Album" description="Album page" />

      <AlbumCell id={id} />
      <div className="mt-4 flex justify-between">
        <Link to={routes.albums()}>Back to albums</Link>
        <Link to={routes.uploads()}>Back to uploads</Link>
      </div>
    </>
  )
}

export default AlbumPage
