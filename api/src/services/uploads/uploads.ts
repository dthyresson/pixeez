import { GetRedwoodUploadTokenResolver } from 'types/uploads'

import { APP_NAME, createUploadToken, UploadTokenPayload } from './util'
export const getRedwoodUploadToken: GetRedwoodUploadTokenResolver = async ({
  operationName,
}) => {
  // Note: based on the operation name, we could configure the content types, max file size, etc
  const payload: UploadTokenPayload = {
    app: APP_NAME,
    action: operationName,
    expiresIn: 24 * 60 * 60,
  }

  const token = createUploadToken(payload)

  return { token }
}
