import { useState } from 'react'

import type { FindAlbumQuery, FindAlbumQueryVariables } from 'types/graphql'

import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'

export const beforeQuery = (props: FindAlbumQueryVariables) => {
  return {
    variables: props,
    pollInterval: 2_500,
  }
}

export const QUERY: TypedDocumentNode<FindAlbumQuery, FindAlbumQueryVariables> =
  gql`
    query FindAlbumQuery($id: Int!) {
      album: album(id: $id) {
        id
        name
        pics {
          id
          original
          processed
        }
      }
    }
  `

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({
  error,
}: CellFailureProps<FindAlbumQueryVariables>) => (
  <div style={{ color: 'red' }}>Error: {error?.message}</div>
)

export const Success = ({
  album,
}: CellSuccessProps<FindAlbumQuery, FindAlbumQueryVariables>) => {
  return (
    <div>
      <h1>{album.name}</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {album.pics.map((pic) => (
          <ImageWithHover
            key={`album-${album.id}-pic-${pic.id}`}
            pic={pic}
            albumName={album.name}
          />
        ))}
      </div>
    </div>
  )
}

const ImageWithHover = ({ pic, albumName }) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className="h-64 overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img
        src={isHovered ? pic.original : pic.processed || pic.original}
        alt={`${albumName} - ${pic.id}`}
        loading="lazy"
        className="h-full w-full object-cover"
      />
    </div>
  )
}
