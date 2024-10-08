import { useState } from 'react'

import { ArrowDownOnSquareIcon } from '@heroicons/react/24/solid'
import type { Album, Pic } from 'types/graphql'

export const PicWithHover = ({
  pic,
  albumName,
}: {
  pic: Pic
  albumName: Album['name']
}) => {
  const [isHovered, setIsHovered] = useState(false)

  const handleDownloadClick = (e) => {
    e.stopPropagation()
  }

  return (
    <div className="relative">
      <img
        src={isHovered ? pic.original : pic.withoutBackground || pic.original}
        alt={`${albumName} - ${pic.id}`}
        loading="lazy"
        className="h-full min-h-48 w-full bg-amber-200 object-contain dark:bg-amber-200"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      />
      {pic.withoutBackground && (
        <a
          href={`/.redwood/functions/download?picId=${pic.id}`}
          download={`${pic.original.replace(/\s+/g, '_')}.jpg`}
          className="absolute bottom-2 right-2 rounded bg-neutral-400 px-2 py-1 text-sm text-white dark:bg-neutral-700"
          onClickCapture={handleDownloadClick}
        >
          <ArrowDownOnSquareIcon className="h-4 w-4 text-neutral-200" />
        </a>
      )}
    </div>
  )
}
