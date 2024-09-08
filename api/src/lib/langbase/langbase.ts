import { Pipe } from 'langbase'

export { Pipe }
import { logger } from 'src/lib/logger'

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

export const parsePipeCompletion = async ({
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
