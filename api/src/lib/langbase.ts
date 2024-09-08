import { Pipe } from 'langbase'

import { logger } from 'src/lib/logger'

interface Tags {
  [key: string]: string[]
}

// Langbase SDK types (partial)
type Role = 'user' | 'assistant' | 'system' | 'tool'

interface Message {
  role: Role
  content: string | null
  name?: string
}

interface Variable {
  name: string
  value: string
}

interface GenerateOptions {
  messages?: Message[]
  variables?: Variable[]
}

const parsePipeCompletion = async ({
  pipe,
  options,
}: {
  pipe: Pipe
  options: GenerateOptions
}) => {
  try {
    const { completion } = await pipe.generateText(options)

    return JSON.parse(completion)
  } catch (error) {
    logger.error(error, '>> parseCompletion error')
    throw new Error('Bad completion')
  }
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
