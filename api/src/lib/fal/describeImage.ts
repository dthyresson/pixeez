import { fal } from './fal'

export const describeImage = async ({ imageUrl }: { imageUrl: string }) => {
  return await fal.run('fal-ai/florence-2-large/more-detailed-caption', {
    input: {
      image_url: imageUrl,
    },
  })
}
