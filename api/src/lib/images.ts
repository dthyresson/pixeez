import { logger } from './logger'
import { storage } from './storage'
export const getBase64DataUri = async (filePath: string): Promise<string> => {
  try {
    const file = await storage.readFile(filePath)
    const base64Data = Buffer.from(await file.arrayBuffer()).toString('base64')
    const mimeType = file.type

    const dataUri = `data:${mimeType};base64,${base64Data}`
    // logger.debug({ dataUri }, 'dataUri')
    return dataUri
  } catch (error) {
    logger.error({ error, filePath }, 'Error creating base64 data URI')
    throw error
  }
}
