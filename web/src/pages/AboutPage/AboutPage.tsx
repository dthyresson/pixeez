import { Metadata } from '@redwoodjs/web'

const AboutPage = () => {
  return (
    <>
      <Metadata
        title="About PicThang"
        description="About PicThang - A tribute to PicThing"
      />

      <h1 className="mb-4 text-3xl font-bold">About PicThang</h1>
      <p className="mb-4">
        A tribute to{' '}
        <a
          href="https://pic.ping.gg/login"
          className="text-purple-600 hover:underline"
        >
          PicThing
        </a>
      </p>

      <h2 className="mb-2 mt-6 text-2xl font-semibold">Features</h2>
      <ul className="mb-4 list-inside list-disc space-y-1">
        <li>Albums</li>
        <li>Upload images using RedwoodJS Storage</li>
        <li>
          Background removal using{' '}
          <a
            href="https://fal.ai/models/fal-ai/birefnet"
            className="text-purple-600 hover:underline"
          >
            birefnet on fal.ai
          </a>
        </li>
        <li>
          RedwoodJS background jobs for:
          <ul className="ml-6 list-inside list-disc space-y-1">
            <li>
              Background removal using{' '}
              <a
                href="https://fal.ai/models/fal-ai/birefnet"
                className="text-purple-600 hover:underline"
              >
                birefnet on fal.ai
              </a>
            </li>
            <li>
              Image description using{' '}
              <a
                href="https://fal.ai/models/fal-ai/florence-2-large/more-detailed-caption"
                className="text-purple-600 hover:underline"
              >
                florence-2-large on fal.ai
              </a>
            </li>
            <li>
              Automatic image tagging using{' '}
              <a
                href="https://www.langbase.com"
                className="text-purple-600 hover:underline"
              >
                Langbase
              </a>
            </li>
          </ul>
        </li>
        <li>Real-time live query updates for processed images and tags</li>
        <li>Search functionality with pagination</li>
        <li>Dark mode support</li>
        <li>Rate limiting using [Unkey](https://unkey.com/)</li>
        <li>
          uuid generation using{' '}
          <a
            href="https://www.unkey.com/blog/uuid-ux"
            className="text-purple-600 hover:underline"
          >
            The UX of UUIDs
          </a>{' '}
          pattern from{' '}
          <a
            href="https://unkey.com/"
            className="text-purple-600 hover:underline"
          >
            Unkey
          </a>
        </li>
      </ul>

      <h2 className="mb-2 mt-6 text-2xl font-semibold">Technologies Used</h2>
      <ul className="mb-4 list-inside list-disc space-y-1">
        <li>
          <a
            href="https://redwoodjs.com/"
            className="text-purple-600 hover:underline"
          >
            RedwoodJS
          </a>{' '}
          for the full stack framework with jobs, storage, uploads, and more
        </li>
        <li>
          <a
            href="https://tailwindcss.com/"
            className="text-purple-600 hover:underline"
          >
            Tailwind CSS
          </a>{' '}
          for styling
        </li>
        <li>
          <a
            href="https://www.prisma.io/"
            className="text-purple-600 hover:underline"
          >
            Prisma
          </a>{' '}
          for the database ORM
        </li>
        <li>
          <a
            href="https://graphql.org/"
            className="text-purple-600 hover:underline"
          >
            GraphQL
          </a>{' '}
          for the API
        </li>
        <li>
          <a href="https://fal.ai/" className="text-purple-600 hover:underline">
            Fal.ai
          </a>{' '}
          for AI-powered background removal and image description
        </li>
        <li>
          <a
            href="https://langbase.com/"
            className="text-purple-600 hover:underline"
          >
            Langbase
          </a>{' '}
          for composable AI models used to generate image tags
        </li>
        <li>
          <a
            href="https://unkey.com/"
            className="text-purple-600 hover:underline"
          >
            Unkey
          </a>{' '}
          for rate limiting
        </li>
        <li>
          <a
            href="https://cursor.com/"
            className="text-purple-600 hover:underline"
          >
            Cursor
          </a>{' '}
          for AI-powered code generation
        </li>
      </ul>

      <h2 className="mb-2 mt-6 text-2xl font-semibold">Key Features</h2>
      <h3 className="mb-2 mt-4 text-xl font-semibold">
        Image Upload and Processing
      </h3>
      <p className="mb-2">
        Images can be uploaded to albums and are automatically processed in the
        background. The processing includes:
      </p>
      <ol className="mb-4 list-inside list-decimal space-y-1">
        <li>Metadata extraction (EXIF data, dimensions, format)</li>
        <li>Background removal</li>
        <li>AI-powered image description</li>
        <li>Automatic tagging based on the description</li>
      </ol>

      <h3 className="mb-2 mt-4 text-xl font-semibold">Album Management</h3>
      <p className="mb-4">
        Users can create and manage multiple albums to organize their images.
      </p>

      <h3 className="mb-2 mt-4 text-xl font-semibold">Tagging System</h3>
      <p className="mb-4">
        Images are automatically tagged based on their AI-generated
        descriptions, allowing for easy categorization and searching.
      </p>

      <h3 className="mb-2 mt-4 text-xl font-semibold">Dark Mode</h3>
      <p className="mb-4">
        The application supports both light and dark modes for user preference.
      </p>

      <h2 className="mb-2 mt-6 text-2xl font-semibold">TODO</h2>
      <ul className="mb-4 list-inside list-disc space-y-1">
        <li>Implement user authentication and authorization</li>
        <li>Implement real-time updates for processed images</li>
        <li>Optimize performance for large image collections</li>
        <li>Add more advanced image editing features</li>
      </ul>

      <h2 className="mb-2 mt-6 text-2xl font-semibold">Contributing</h2>
      <p className="mb-4">
        Contributions are welcome! Please feel free to submit a Pull Request.
      </p>

      <h2 className="mb-2 mt-6 text-2xl font-semibold">License</h2>
      <p className="mb-4">
        This project is open-source and available under the{' '}
        <a
          href="https://opensource.org/licenses/MIT"
          className="text-purple-600 hover:underline"
        >
          MIT License
        </a>
        .
      </p>
    </>
  )
}

export default AboutPage
