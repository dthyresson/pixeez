import { Pic } from 'types/graphql'

import { PicWithHover } from './PicWithHover'

export const PicsGrid = ({ pics }: { pics: Pic[] }) => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {pics.map((pic) => (
        <PicWithHover key={pic.id} pic={pic} albumName={pic.album.name} />
      ))}
    </div>
  )
}
