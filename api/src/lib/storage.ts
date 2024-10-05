// Setup and configuration for storage
// See: https://docs.redwoodjs.com/docs/storage

import path from 'node:path'

import { FileSystemAdapter } from '@redwoodjs/storage-adapter-filesystem'
import { MemoryAdapter } from '@redwoodjs/storage-adapter-memory'
import { S3Adapter } from '@redwoodjs/storage-adapter-s3'
import { StorageManager, StorageSelfSigner } from '@redwoodjs/storage-core'
const baseUrl = process.env.STORAGE_SIGNING_BASE_URL
export const signer = new StorageSelfSigner({
  secret: process.env.STORAGE_SIGNING_SECRET,
})

export const storage = new StorageManager({
  adapters: {
    local: new FileSystemAdapter({
      root: path.join(__dirname, '..', '..', '.storage'),
      signing: {
        signer,
        baseUrl,
      },
    }),
    s3: new S3Adapter({
      bucket: process.env.AWS_BUCKET,
      region: process.env.AWS_REGION,
      endpoint: process.env.AWS_ENDPOINT_URL_S3,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    }),
    memory: new MemoryAdapter({
      signing: {
        signer,
        baseUrl,
      },
    }),
    special: new FileSystemAdapter({
      root: path.join(__dirname, '..', '..', '.storage-special'),
      signing: {
        signer,
        baseUrl,
      },
    }),
  },

  default: 'local',

  env: {
    development: 'local',
  },
})
