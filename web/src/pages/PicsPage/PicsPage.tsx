import { Link, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'

import PicsCell from 'src/components/PicsCell'

const PicsPage = () => {
  return (
    <>
      <Metadata title="Pics" description="Pics page" />

      <h1 className="mb-4 text-2xl font-bold">Pics</h1>
      <div className="mb-4">
        <Link to={routes.upload()}>Upload</Link>
      </div>
      <PicsCell />
    </>
  )
}

export default PicsPage
