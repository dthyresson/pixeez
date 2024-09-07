import { Router, Route, Set } from '@redwoodjs/router'

import MainLayout from 'src/layouts/MainLayout/MainLayout'

const Routes = () => {
  return (
    <Router>
      <Set wrap={MainLayout}>
        <Route path="/pics" page={PicsPage} name="pics" />
        <Route path="/" page={UploadsPage} name="uploads" />
        <Route path="/upload" page={UploadPage} name="upload" />
      </Set>
      <Route notfound page={NotFoundPage} />
    </Router>
  )
}

export default Routes
