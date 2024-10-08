import type { SearchResolver } from 'types/search'

import { db } from 'src/lib/db'
import { logger } from 'src/lib/logger'

export const search: SearchResolver = async ({
  query,
  page = 1,
  limit = 10,
}: {
  query: string
  page: number
  limit: number
}) => {
  const count = await db.pic.count()

  if (!query || query.length === 0) {
    logger.info('No query provided, returning latest pics')
    const pics = await db.pic.findMany({
      include: {
        album: true,
        tags: true,
      },
      orderBy: { updatedAt: 'desc' },
      take: limit,
      skip: (page - 1) * limit,
    })

    return {
      items: pics,
      count,
      page,
      limit,
    }
  }

  logger.info({ query }, 'Searching for query')
  const pics = await db.pic.findMany({
    include: {
      album: true,
      tags: true,
    },
    where: {
      OR: [
        { exif: { contains: query } },
        { description: { contains: query } },
        { tags: { some: { name: { contains: query } } } },
      ],
    },
    take: limit,
    skip: (page - 1) * limit,
  })

  logger.info({ count }, 'total pics')

  return {
    items: pics,
    count,
    page,
    limit,
  }
}
