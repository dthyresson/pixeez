import jwt from 'jsonwebtoken'
import { GetRedwoodUploadTokenResolver } from 'types/uploads'

export const getRedwoodUploadToken: GetRedwoodUploadTokenResolver = async ({
  operationName,
}) => {
  const secret = process.env.UPLOAD_TOKEN_SECRET
  if (!secret) {
    throw new Error('UPLOAD_TOKEN_SECRET is not set')
  }

  // based on the operation name, we can determine the content types, max file size, etc

  const token = jwt.sign(
    {
      aud: 'uploads',
      sub: operationName,
      iss: 'pixeez',
      contentTypes: ['image/png'],
      maxFileSize: 1_000_000,
      maxFiles: 3,
      minFiles: 1,
    },
    secret,
    {
      algorithm: 'HS256',
      expiresIn: '1hr',
    }
  )

  return { token }
}
