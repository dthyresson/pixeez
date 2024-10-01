import jwt from 'jsonwebtoken'
import { GetRedwoodUploadTokenResolver } from 'types/uploads'

type UploadTokenPayload = {
  aud: string
  sub: string
  iss: string
  contentTypes: string[]
  maxFileSize: number
  maxFiles: number
  minFiles: number
}

export const getRedwoodUploadToken: GetRedwoodUploadTokenResolver = async ({
  operationName,
}) => {
  const secret = process.env.UPLOAD_TOKEN_SECRET

  if (!secret) {
    throw new Error('UPLOAD_TOKEN_SECRET is not set')
  }

  // Note: based on the operation name, we could configure the content types, max file size, etc
  const payload: UploadTokenPayload = {
    aud: 'uploads',
    sub: operationName,
    iss: 'pixeez',
    contentTypes: ['image/png'],
    maxFileSize: 1_000_000,
    maxFiles: 3,
    minFiles: 1,
  }

  const token = jwt.sign(payload, secret, {
    algorithm: 'HS256',
    expiresIn: '1hr',
  })

  return { token }
}
