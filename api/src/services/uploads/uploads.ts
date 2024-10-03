import { GetRedwoodUploadTokenResolver } from 'types/uploads'

import { createUploadToken } from 'src/plugins/useRedwoodUpload'
import type { UploadTokenPayload } from 'src/plugins/useRedwoodUpload'

export const getRedwoodUploadToken: GetRedwoodUploadTokenResolver = async ({
  operationName,
}) => {
  // Note: based on the operation name, we could configure the content types, max file size, etc
  const payload: UploadTokenPayload = {
    // app: 'h',
    action: operationName,
    expiresIn: 24 * 60 * 60,
  }

  const token = createUploadToken(payload)

  return { token }
}
