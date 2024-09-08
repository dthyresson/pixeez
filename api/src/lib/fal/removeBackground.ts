import { fal } from './fal'

export const removeBackground = async ({ imageUrl }: { imageUrl: string }) => {
  return await fal.run('fal-ai/birefnet', {
    input: {
      image_url: imageUrl,
      model: 'General Use (Light)',
      output_format: 'png',
    },
  })
}
