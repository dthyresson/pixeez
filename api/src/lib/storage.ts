import { createUploadsConfig, setupStorage } from '@redwoodjs/storage'
import { FileSystemStorage } from '@redwoodjs/storage/FileSystemStorage'
import { UrlSigner } from '@redwoodjs/storage/UrlSigner'

const uploadsConfig = createUploadsConfig({
  // Configure your fields here
  // e.g. modelName: { fields: ['fieldWithUpload']}
  pic: { fields: ['original'] },
})

export const fsStorage = new FileSystemStorage({
  baseDir: './storage',
})

export const urlSigner = new UrlSigner({
  secret: process.env.STORAGE_SECRET,
  endpoint: '/signedUrl',
})

const { saveFiles, storagePrismaExtension } = setupStorage({
  uploadsConfig,
  storageAdapter: fsStorage,
  urlSigner,
})

export { saveFiles, storagePrismaExtension }
