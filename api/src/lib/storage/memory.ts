import { createUploadsConfig, setupStorage } from '@redwoodjs/storage'
import { MemoryStorage } from '@redwoodjs/storage/MemoryStorage'
import { UrlSigner } from '@redwoodjs/storage/UrlSigner'

const uploadsConfig = createUploadsConfig({
  // Configure your fields here
  // e.g. modelName: { fields: ['fieldWithUpload']}
  pic: { fields: ['original'] },
})

const config = {
  baseDir: './memory',
}
export const memoryStorage = new MemoryStorage(config)

export const urlSigner = new UrlSigner({
  secret: process.env.STORAGE_SECRET,
  endpoint: '/signedUrl',
})

const { saveFiles, storagePrismaExtension } = setupStorage({
  uploadsConfig,
  storageAdapter: memoryStorage,
  urlSigner,
})

export { config, saveFiles, storagePrismaExtension }
