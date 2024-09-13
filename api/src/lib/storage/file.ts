import { createUploadsConfig, setupStorage } from '@redwoodjs/storage'
import { FileSystemStorage } from '@redwoodjs/storage/FileSystemStorage'
import { UrlSigner } from '@redwoodjs/storage/UrlSigner'

const uploadsConfig = createUploadsConfig({
  // Configure your fields here
  // e.g. modelName: { fields: ['fieldWithUpload']}
  pic: { fields: ['original'] },
})

const config = {
  baseDir: './storage',
}

export const fsStorage = new FileSystemStorage(config)

export const urlSigner = new UrlSigner({
  secret: process.env.STORAGE_SECRET,
  endpoint: '/signedUrl',
})

const { saveFiles, storagePrismaExtension } = setupStorage({
  uploadsConfig,
  storageAdapter: fsStorage,
  urlSigner,
})

export { config, saveFiles, storagePrismaExtension }
