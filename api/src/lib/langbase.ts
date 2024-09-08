import { Pipe } from 'langbase'

import { logger } from 'src/lib/logger'

export const tagify = async ({
  description,
}: {
  description: string
}): Promise<Record<string, string[]>> => {
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

  logger.debug(options, '>> tagifyPic options')

  try {
    const { completion } = await pipe.generateText(options)

    if (!completion) {
      logger.error('>> tagifyPic completion error')
      throw new Error('Bad response from tagifyPic')
    }

    logger.debug({ completion }, '>> tagifyPic result')

    const result = JSON.parse(completion)
    logger.debug({ result }, '>> tagifyPic result')
    return result
  } catch (error) {
    logger.error(error, '>> tagifyPic error')
  }

  throw new Error('Failed to generate bedtime story')
}
