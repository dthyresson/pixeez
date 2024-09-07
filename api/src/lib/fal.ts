import * as fal from '@fal-ai/serverless-client'

fal.config({
  credentials: process.env.FAL_KEY,
})

export const removeBackground = async ({ imageUrl }: { imageUrl: string }) => {
  return await fal.run('fal-ai/imageutils/rembg', {
    input: {
      image_url: imageUrl,
    },
  })
}
