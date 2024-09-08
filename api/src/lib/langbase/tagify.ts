import { logger } from 'src/lib/logger'

import { Pipe, parsePipeCompletion } from './langbase'

interface Tags {
  [key: string]: string[]
}

export const tagify = async ({
  description,
}: {
  description: string
}): Promise<Tags> => {
  try {
    if (!process.env.TAGIFY_IMAGE_DESCRIPTION_PIPE_API_KEY) {
      throw new Error('TAGIFY_IMAGE_DESCRIPTION_PIPE_API_KEY is not set')
    }

    const pipe = new Pipe({
      apiKey: process.env.TAGIFY_IMAGE_DESCRIPTION_PIPE_API_KEY,
    })

    const options = {
      variables: [
        {
          name: 'description',
          value: description,
        },
      ],
    }

    return parsePipeCompletion({ pipe, options })
  } catch (error) {
    logger.error(error, '>> tagifyPic error')
    throw error
  }
}
