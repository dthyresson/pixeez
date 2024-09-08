import { Metadata } from '@redwoodjs/web'

import TagsCell from 'src/components/TagsCell'

const TagsPage = () => {
  return (
    <>
      <Metadata title="Tags" description="Tags page" />

      <h1 className="mb-4 text-xl font-bold">Tags</h1>
      <TagsCell />
    </>
  )
}

export default TagsPage
