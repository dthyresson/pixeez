import { createHash } from 'crypto'

import type { APIGatewayEvent, Context } from 'aws-lambda'

import { storage, signer } from 'src/lib/storage'

export const handler = async (event: APIGatewayEvent, _context: Context) => {
  const unauthorizedResponse = {
    statusCode: 401,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ error: 'Unauthorized' }),
  }

  const notFoundResponse = {
    statusCode: 404,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ error: 'Not Found' }),
  }

  const serverErrorResponse = {
    statusCode: 500,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ error: 'Server Error' }),
  }

  // Extract the token
  const token = event.queryStringParameters?.token
  if (!token) {
    return unauthorizedResponse
  }

  // Decode the token
  const decoded = signer.decode(token)
  if (!decoded) {
    return unauthorizedResponse
  }

  const { adapter: adapterName, reference, expiry } = decoded

  // Validate the expiry
  if (expiry && expiry < Date.now()) {
    return unauthorizedResponse
  }

  // Validate the adapter
  const adapter = storage.findAdapter(adapterName)
  if (!adapter) {
    return unauthorizedResponse
  }

  // if exists?
  const exists = await adapter.exists(reference)
  if (!exists) {
    return notFoundResponse
  }

  try {
    // Lookup and return the data
    const result = await adapter.readData(reference)

    // Generate ETag using a hash of the reference and content
    const contentHash = createHash('sha256')
      .update(reference)
      .update(result)
      .digest('hex')
    const etag = `"${contentHash.slice(0, 32)}"`

    return {
      statusCode: 200,
      headers: {
        ETag: etag,
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
        'Content-Type': 'application/octet-stream', // Generic binary data
        'X-Content-Type-Options': 'nosniff', // Prevent MIME type sniffing
        'X-Frame-Options': 'DENY', // Prevent clickjacking
        'Strict-Transport-Security': 'max-age=31536000; includeSubDomains', // Enforce HTTPS
        'Access-Control-Allow-Origin': '*', // CORS - adjust as needed
        'Access-Control-Allow-Methods': 'GET, OPTIONS', // CORS - adjust as needed
      },
      body: result,
    }
  } catch (error) {
    console.error(error)
    return serverErrorResponse
  }
}
