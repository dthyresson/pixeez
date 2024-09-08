import { Metadata } from '@redwoodjs/web'

const AboutPage = () => {
  return (
    <>
      <Metadata title="About picthang" description="About picthang" />

      <h1 className="text-3xl font-bold">About</h1>
      <p className="mt-4">PicThang is a tribute to picthing. You can:</p>
      <ul className="mt-2 list-inside list-disc space-y-2">
        <li>Create and organize multiple photo albums</li>
        <li>Upload images to your albums</li>
        <li>Automatically remove backgrounds from uploaded images</li>
        <li>View your images with or without backgrounds</li>
        <li>Manage your photo collection with ease</li>
      </ul>
      <p className="mt-4">
        Built with RedwoodJS, PicThang uses modern web technologies to provide a
        smooth and responsive user experience. The background removal feature is
        powered by Fal, making it easy to create professional-looking images for
        various purposes.
      </p>
      <p className="mt-4">
        PicThang leverages Redwood&apos;s powerful features:
      </p>
      <ul className="mt-2 list-inside list-disc space-y-2">
        <li>The Storage package for efficient file uploads and management</li>
        <li>
          The Jobs package for handling background tasks like image processing
        </li>
      </ul>
    </>
  )
}

export default AboutPage
