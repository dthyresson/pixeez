import jwt from 'jsonwebtoken'
import { GetUploadTokenResolver } from 'types/uploads'

export const getUploadToken: GetUploadTokenResolver = async ({
  operationName,
}) => {
  const secret = process.env.STORAGE_SIGNING_SECRET
  if (!secret) {
    throw new Error('STORAGE_SIGNING_SECRET is not set')
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
      expiresIn: '10s',
    }
  )

  return { token }
}
