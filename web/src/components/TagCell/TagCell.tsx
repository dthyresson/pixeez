import type { FindTagQuery, FindTagQueryVariables } from 'types/graphql'

import { Metadata } from '@redwoodjs/web'
import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'

import { Error } from 'src/components/CellStates/Error'
import { Spinner } from 'src/components/CellStates/Spinner'
import { ImageWithHover } from 'src/components/Image/ImageWithHover'

export const QUERY: TypedDocumentNode<FindTagQuery, FindTagQueryVariables> =
  gql`
    query FindTagQuery($id: Int!) {
      tag: tag(id: $id) {
        id
        name
        pics {
          id
          album {
            id
            name
          }
          original
          processed
          description
        }
      }
    }
  `

export const Empty = () => <div>Empty</div>

export const Failure = ({ error }: CellFailureProps<FindTagQueryVariables>) => (
  <Error error={error} />
)

export const Loading = () => <Spinner />

export const Success = ({
  tag,
}: CellSuccessProps<FindTagQuery, FindTagQueryVariables>) => {
  return (
    <>
      <Metadata title={`${tag.name} Tag`} description={`${tag.name} Tag`} />
      <div>
        <h1 className="mb-4 text-2xl font-bold">{tag.name}</h1>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {tag.pics.map((pic) => (
            <ImageWithHover
              key={`tag-${pic.album.id}-pic-${pic.id}`}
              pic={pic}
              albumName={pic.album.name}
            />
          ))}
        </div>
      </div>
    </>
  )
}
