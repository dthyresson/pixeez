import jwt from 'jsonwebtoken'
import { GetRedwoodUploadTokenResolver } from 'types/uploads'

export const getRedwoodUploadToken: GetRedwoodUploadTokenResolver = async ({
  operationName,
}) => {
  const secret = process.env.UPLOAD_TOKEN_SECRET
  if (!secret) {
    throw new Error('UPLOAD_TOKEN_SECRET is not set')
  }

  const token = jwt.sign(
    {
      aud: operationName,
      sub: 'upload',
      iss: 'redwood-storage',
    },
    secret,
    {
      algorithm: 'HS256',
      expiresIn: '1m',
    }
  )

  return { token }
}
