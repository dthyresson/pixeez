import * as fal from '@fal-ai/serverless-client'

fal.config({
  credentials: process.env.FAL_KEY,
})

export const removeBackground = async ({ imageUrl }: { imageUrl: string }) => {
  return await fal.run('fal-ai/birefnet', {
    input: {
      image_url: imageUrl,
      model: 'General Use (Light)',
      output_format: 'png',
    },
  })
}

export const describeImage = async ({ imageUrl }: { imageUrl: string }) => {
  return await fal.run('fal-ai/florence-2-large/more-detailed-caption', {
    input: {
      image_url: imageUrl,
    },
  })
}
