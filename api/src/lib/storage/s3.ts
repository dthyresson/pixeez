import { createUploadsConfig, setupStorage } from '@redwoodjs/storage'
import type { S3StorageOptions } from '@redwoodjs/storage/S3Storage'
import { S3Storage } from '@redwoodjs/storage/S3Storage'
import { S3UrlSigner } from '@redwoodjs/storage/S3Storage'

const uploadsConfig = createUploadsConfig({
  // Configure your fields here
  // e.g. modelName: { fields: ['fieldWithUpload']}
  pic: { fields: ['original'] },
})

const config = {
  baseDir: 'picthang',
  bucket: process.env.AWS_BUCKET,
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  endpoint: process.env.AWS_ENDPOINT_URL_S3,
  cacheControl: 'max-age=3600',
  tags: [
    { Key: 'pic', Value: 'photo' },
    { Key: 'redwood', Value: 'redwoodjs' },
  ],
} as S3StorageOptions

export const s3Storage = new S3Storage(config)

export const s3UrlSigner = new S3UrlSigner({
  storage: s3Storage,
})

const { saveFiles, storagePrismaExtension } = setupStorage({
  uploadsConfig,
  storageAdapter: s3Storage,
  urlSigner: s3UrlSigner,
})

export { config, saveFiles, storagePrismaExtension }
