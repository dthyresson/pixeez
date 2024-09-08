import { Router, Route, Set } from '@redwoodjs/router'

import MainLayout from 'src/layouts/MainLayout/MainLayout'

const Routes = () => {
  return (
    <Router>
      <Set wrap={MainLayout}>
        <Route path="/" page={AlbumsPage} name="albums" />
        <Route path="/album/{id:Int}" page={AlbumPage} name="album" />
        <Route path="/about" page={AboutPage} name="about" />
        <Route path="/tag/{id:Int}" page={TagPage} name="tag" />
        <Route path="/tags" page={TagsPage} name="tags" />
        <Route path="/search" page={SearchPage} name="search" />
      </Set>
      <Route notfound page={NotFoundPage} />
    </Router>
  )
}

export default Routes
