import type { APIGatewayEvent, Context } from 'aws-lambda'

import type { SignatureValidationArgs } from '@redwoodjs/storage/UrlSigner'
import { UrlSigner } from '@redwoodjs/storage/UrlSigner'

import { logger } from 'src/lib/logger'
import { s3Storage } from 'src/lib/storage'

export const handler = async (event: APIGatewayEvent, _context: Context) => {
  try {
    const urlSigner = new UrlSigner({
      secret: process.env.STORAGE_SECRET,
      endpoint: '/signedUrl',
    })

    const fileToReturn = urlSigner.validateSignature(
      event.queryStringParameters as SignatureValidationArgs
    )

    // Note this is double signing the url with Redwood UrlSigner.
    // With S3Storage we just use the signedUrl it generates.
    const signedUrl = await s3Storage.sign(fileToReturn)

    return {
      statusCode: 302,
      headers: {
        Location: signedUrl,
      },
    }

    // When using the fsStorage we need validate the signature
    // and return the file contents

    // Generate an ETag from the file contents
    // const etag = Buffer.from(contents).toString('base64').substring(0, 27)

    // return {
    //   statusCode: 200,
    //   headers: {
    //     // 'Content-Type': type,
    //     'Cache-Control': 'public, max-age=31536000, immutable',
    //     ETag: `"${etag}"`,
    //     Date: new Date().toUTCString(),
    //     'Access-Control-Allow-Headers': '*',
    //     'Access-Control-Allow-Methods': '*',
    //     'Access-Control-Allow-Origin': '*',
    //     'Access-Control-Max-Age': '86400',
    //   },
    //   body: contents,
    // }
  } catch (error) {
    logger.error(error, 'Error reading file')
    return {
      statusCode: 404,
      body: 'Not found',
    }
  }
}
