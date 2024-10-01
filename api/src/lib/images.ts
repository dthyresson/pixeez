import { storage } from './storage'

export const getBase64DataUri = async (filePath: string): Promise<string> => {
  const data = await storage.readFile(filePath)
  const arrayBuffer = await data.arrayBuffer()
  const base64Data = Buffer.from(arrayBuffer).toString('base64')
  const mimeType = data.type
  return `data:${mimeType};base64,${base64Data}`
}
