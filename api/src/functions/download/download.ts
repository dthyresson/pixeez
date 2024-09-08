import type { APIGatewayEvent, Context } from 'aws-lambda'
import fetch from 'node-fetch'

import { logger } from 'src/lib/logger'
import { pic } from 'src/services/pics'

export const handler = async (event: APIGatewayEvent, _context: Context) => {
  try {
    const picId = event.queryStringParameters?.picId
    if (!picId) {
      throw new Error('picId is required')
    }

    const thePic = await pic({ id: picId })

    if (!thePic.withoutBackground) {
      throw new Error('processed pic not found')
    }

    logger.info({ pic: thePic }, 'found pic')

    const response = await fetch(thePic.withoutBackground)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const contentType =
      response.headers.get('content-type') || 'application/octet-stream'

    // Create a safe filename

    const safeTitle = thePic.original.replace(/[^a-z0-9]/gi, '_').toLowerCase()
    const timestamp = Date.now()
    const safeFilename = `${safeTitle}_${thePic.id}_${timestamp}.jpg`

    // Read the entire response body as a buffer
    const buffer = await streamToBuffer(response.body)
    return {
      statusCode: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${safeFilename}"`,
      },
      body: buffer.toString('base64'),
      isBase64Encoded: true,
    }
  } catch (error) {
    logger.error(error)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    }
  }
}

// Helper function to convert a readable stream to a buffer
async function streamToBuffer(stream: NodeJS.ReadableStream): Promise<Buffer> {
  const chunks: Buffer[] = []
  return new Promise((resolve, reject) => {
    stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)))
    stream.on('error', (err) => reject(err))
    stream.on('end', () => resolve(Buffer.concat(chunks)))
  })
}
