import { useState } from 'react'

import { SearchQuery, SearchQueryVariables } from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import { Metadata, TypedDocumentNode } from '@redwoodjs/web'
import { useQuery } from '@redwoodjs/web'

const SEARCH_QUERY: TypedDocumentNode<SearchQuery, SearchQueryVariables> = gql`
  query SearchQuery($query: String!, $page: Int!, $limit: Int!) {
    search(query: $query, page: $page, limit: $limit) {
      items {
        id
        original
        processed
        exif
        description
        createdAt
        updatedAt
        album {
          id
          name
        }
        tags {
          id
          name
        }
      }
      count
      page
      limit
    }
  }
`

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [page, setPage] = useState(1)
  const limit = 10

  const { data, loading, error } = useQuery(SEARCH_QUERY, {
    variables: { query: searchQuery, page, limit },
    skip: searchQuery.length < 3,
  })

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.length >= 3) {
      setPage(1)
    }
  }

  const totalPages = data ? Math.ceil(data.search.count / limit) : 0

  const formatExif = (exifString: string) => {
    try {
      const exifObj = JSON.parse(exifString)
      return Object.entries(exifObj)
        .map(([key, value]) => `${key}: ${value}`)
        .join('\n')
    } catch {
      return exifString
    }
  }

  return (
    <>
      <Metadata title="Search" description="Search page" />
      <h2 className="mb-4 text-2xl font-bold">Search</h2>

      <form onSubmit={handleSearch} className="mb-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="mr-2 rounded border p-2 dark:bg-gray-800 dark:text-white"
          placeholder="Search images ..."
        />
        <button
          type="submit"
          className="rounded bg-purple-500 px-4 py-2 text-white"
          disabled={searchQuery.length < 3}
        >
          🔎&nbsp;Search
        </button>
      </form>

      {searchQuery.length < 3 && searchQuery.length > 0 && (
        <p className="mb-4 text-purple-500">
          Search query must be at least 3 characters long.
        </p>
      )}

      {loading && <div>Searching...</div>}
      {error && <div>Error: {error.message}</div>}

      {data && (
        <>
          <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {data.search.items.map((item) => (
              <div key={item.id} className="space-y-4 rounded-lg border p-4">
                <img
                  src={item.original}
                  alt={item.description}
                  className="mb-2  w-full object-cover"
                />
                <h3 className="font-bold">
                  <Link
                    to={routes.album({ id: item.album.id })}
                    className="hover:underline"
                  >
                    {item.album.name}
                  </Link>
                </h3>
                <p className="text-sm">{item.description}</p>
                <p className="text-xs">
                  <ul className="flex flex-wrap gap-2">
                    {item.tags.map((tag) => (
                      <Link
                        key={tag.id}
                        to={routes.tag({ id: tag.id })}
                        className="rounded-sm bg-purple-500 p-2 text-white hover:bg-purple-600 hover:underline"
                      >
                        {tag.name}
                      </Link>
                    ))}
                  </ul>
                </p>
                <pre className="max-h-24 overflow-y-auto whitespace-pre-wrap break-words text-xs text-gray-600">
                  {formatExif(item.exif)}
                </pre>
                <p className="text-xs text-gray-500">
                  Created: {new Date(item.createdAt).toLocaleString()}
                  <br />
                  Updated: {new Date(item.updatedAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className="rounded bg-gray-200 px-4 py-2 hover:bg-gray-300 disabled:opacity-50 dark:bg-gray-800 dark:text-white hover:dark:bg-purple-700"
            >
              Previous
            </button>
            <span>
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
              className="rounded bg-gray-200 px-4 py-2 hover:bg-gray-300 disabled:opacity-50 dark:bg-gray-800 dark:text-white hover:dark:bg-purple-700"
            >
              Next
            </button>
          </div>
        </>
      )}
    </>
  )
}

export default SearchPage
