import exifParser from 'exif-parser'
import sharp from 'sharp'

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

// use sharp to make a thumbnail
export const makeThumbnail = async (filePath: string): Promise<string> => {
  const file = await storage.readData(filePath)
  const thumbnail = await sharp(file)
    .resize(100)
    .jpeg({ quality: 80 })
    .toBuffer()
  const thumbnailPath = await storage.writeData(thumbnail)
  return thumbnailPath
}

// use sharp and exif-parser to extract metadata
export const extractMetadata = async (filePath: string) => {
  const contents = await storage.readData(filePath)
  const image = await sharp(contents).metadata()

  const { height, width, format } = image

  logger.debug({ height, width, format }, 'Image metadata')

  let exif = null

  if (format === 'jpeg' || format === 'jpg') {
    // Extract EXIF data using exif-parser
    const parser = exifParser.create(contents)
    parser.enableSimpleValues(true)

    const result = parser.parse()

    logger.debug({ result }, 'EXIF data')

    exif = JSON.stringify(result.tags || {})
  }

  return { height, width, format, exif }
}
