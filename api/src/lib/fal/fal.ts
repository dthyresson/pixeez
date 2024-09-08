import * as fal from '@fal-ai/serverless-client'
export { fal }

fal.config({
  credentials: process.env.FAL_KEY,
})
