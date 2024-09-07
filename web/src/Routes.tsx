import { Router, Route, Set } from '@redwoodjs/router'

import MainLayout from 'src/layouts/MainLayout/MainLayout'
import AlbumPage from 'src/pages/AlbumPage/AlbumPage'
import AlbumsPage from 'src/pages/AlbumsPage/AlbumsPage'

const Routes = () => {
  return (
    <Router>
      <Set wrap={MainLayout}>
        <Route path="/" page={AlbumsPage} name="albums" />
        <Route path="/album/{id:Int}" page={AlbumPage} name="album" />
        <Route path="/upload" page={UploadsPage} name="uploads" />
        <Route path="/upload_one" page={UploadPage} name="upload" />
        <Route path="/pics" page={PicsPage} name="pics" />
      </Set>
      <Route notfound page={NotFoundPage} />
    </Router>
  )
}

export default Routes
