import { Router, Route, Set } from '@redwoodjs/router'

import MainLayout from 'src/layouts/MainLayout/MainLayout'

const Routes = () => {
  return (
    <Router>
      <Set wrap={MainLayout}>
        <Route path="/" page={AlbumsPage} name="albums" />
        <Route path="/album/{id}" page={AlbumPage} name="album" />
        <Route path="/about" page={AboutPage} name="about" />
        <Route path="/tag/{id}" page={TagPage} name="tag" />
        <Route path="/tags" page={TagsPage} name="tags" />
        <Route path="/search" page={SearchPage} name="search" />
        <Route path="/thumbnails" page={ThumbnailsPage} name="thumbnails" />
      </Set>
      <Route notfound page={NotFoundPage} />
    </Router>
  )
}

export default Routes
