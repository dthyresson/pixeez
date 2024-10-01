// import { Link, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'

import ThumbnailsCell from 'src/components/ThumbnailsCell'

const ThumbnailsPage = () => {
  return (
    <>
      <Metadata title="Thumbnails" description="Thumbnails page" />

      <h1 className="mb-4 text-2xl font-bold">Thumbnails</h1>
      <ThumbnailsCell />
    </>
  )
}

export default ThumbnailsPage
