import {
  config as fileConfig,
  fsStorage,
  urlSigner as fileUrlSigner,
  saveFiles as fsSaveFiles,
  storagePrismaExtension as fsStoragePrismaExtension,
} from './file'
import {
  config as memoryConfig,
  memoryStorage,
  urlSigner as memoryUrlSigner,
  saveFiles as memorySaveFiles,
  storagePrismaExtension as memoryStoragePrismaExtension,
} from './memory'
import {
  config as s3Config,
  s3Storage,
  saveFiles as s3SaveFiles,
  storagePrismaExtension as s3StoragePrismaExtension,
  s3UrlSigner,
} from './s3'

type StorageType = 's3' | 'file' | 'memory'

interface StorageConfig {
  type?: StorageType
}

type StorageReturn<T extends StorageType> = T extends 'file'
  ? {
      config: typeof fileConfig
      adapter: typeof fsStorage
      saveFiles: typeof fsSaveFiles
      storagePrismaExtension: typeof fsStoragePrismaExtension
      urlSigner: typeof fileUrlSigner
    }
  : T extends 'memory'
    ? {
        config: typeof memoryConfig
        adapter: typeof memoryStorage
        saveFiles: typeof memorySaveFiles
        storagePrismaExtension: typeof memoryStoragePrismaExtension
        urlSigner: typeof memoryUrlSigner
      }
    : {
        config: typeof s3Config
        adapter: typeof s3Storage
        saveFiles: typeof s3SaveFiles
        storagePrismaExtension: typeof s3StoragePrismaExtension
        urlSigner: typeof s3UrlSigner
      }

class StorageManager {
  private config: StorageConfig

  constructor(config: StorageConfig = {}) {
    this.config = config
  }

  get storage(): StorageReturn<StorageType> {
    const storageType = this.getStorageType()

    switch (storageType) {
      case 'file':
        return {
          config: fileConfig,
          adapter: fsStorage,
          saveFiles: fsSaveFiles,
          storagePrismaExtension: fsStoragePrismaExtension,
          urlSigner: fileUrlSigner,
        }
      case 'memory':
        return {
          config: memoryConfig,
          adapter: memoryStorage,
          saveFiles: memorySaveFiles,
          storagePrismaExtension: memoryStoragePrismaExtension,
          urlSigner: memoryUrlSigner,
        }
      case 's3':
        return {
          config: s3Config,
          adapter: s3Storage,
          saveFiles: s3SaveFiles,
          storagePrismaExtension: s3StoragePrismaExtension,
          urlSigner: s3UrlSigner,
        }
    }
  }

  private getStorageType(): StorageType {
    if (this.config.type) {
      return this.config.type
    }

    if (this.isDevelopment()) {
      return 'file'
    } else if (this.isTest()) {
      return 'memory'
    } else {
      return 's3'
    }
  }

  isDevelopment(): boolean {
    return process.env.NODE_ENV === 'development'
  }

  isTest(): boolean {
    return process.env.NODE_ENV === 'test'
  }

  isDefault(): boolean {
    return !this.isDevelopment() && !this.isTest()
  }
}

export const storageManager = new StorageManager()
