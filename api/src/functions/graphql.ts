import { createGraphQLHandler } from '@redwoodjs/graphql-server'
import { useRedwoodUploads } from '@redwoodjs/uploads-graphql'

import directives from 'src/directives/**/*.{js,ts}'
import sdls from 'src/graphql/**/*.sdl.{js,ts}'
import services from 'src/services/**/*.{js,ts}'

import { db } from 'src/lib/db'
import { logger } from 'src/lib/logger'
import { realtime } from 'src/lib/realtime'

export const handler = createGraphQLHandler({
  loggerConfig: { logger, options: {} },
  directives,
  sdls,
  services,
  realtime,
  extraPlugins: [
    useRedwoodUploads({
      appName: 'pixeez',
      // uploadTokenHeaderName: 'x-upload-token-header-1',
      errorMessages: {
        tooManyFiles: ({ maxFiles }) =>
          `Wooooooaaaah. Too many files. Max ${maxFiles} files`,
        tooFewFiles: ({ minFiles }) =>
          `Hey there!! Need some more files. Min ${minFiles} files`,
      },
    }),
  ],

  onException: () => {
    // Disconnect from your database with an unhandled exception.
    db.$disconnect()
  },
})
