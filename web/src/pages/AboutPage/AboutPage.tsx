import { Mermaid } from 'mdx-mermaid/Mermaid'
import ReactMarkdown from 'react-markdown'

import { Metadata } from '@redwoodjs/web'

const AboutPage = () => {
  return (
    <>
      <Metadata title="About Pixeex" description="About Pixeez" />
      <div className="prose dark:prose-invert max-w-none">
        <img src="logo.png" alt="Pixeex" className="h-20 w-auto" />
        <ReactMarkdown
          components={{
            h1: ({ node, ...props }) => (
              <h1 className="my-4 text-3xl font-bold" {...props} />
            ),
            h2: ({ node, ...props }) => (
              <h2 className="my-4 text-2xl font-semibold" {...props} />
            ),
            h3: ({ node, ...props }) => (
              <h3 className="my-4 text-xl font-medium" {...props} />
            ),
            ul: ({ node, ...props }) => (
              <ul className="my-4 list-disc pl-5" {...props} />
            ),
            ol: ({ node, ...props }) => (
              <ol className="my-4 list-decimal pl-5" {...props} />
            ),
            p: ({ node, ...props }) => <p className="my-4" {...props} />,
            a: ({ node, ...props }) => (
              <a
                className="text-purple-600 underline hover:text-purple-500 dark:text-purple-400 dark:hover:text-purple-300"
                {...props}
              />
            ),
            code: ({ node, inline, className, children, ...props }) => {
              const match = /language-(\w+)/.exec(className || '')
              if (!inline && match && match[1] === 'mermaid') {
                return (
                  <Mermaid chart={String(children).replace(/\\n/g, '\n')} />
                )
              }
              return (
                <code
                  className="my-2 rounded bg-purple-200 p-1 dark:bg-purple-800 dark:text-white"
                  {...props}
                >
                  {children}
                </code>
              )
            },
          }}
        >
          {
            "# Pixeex\n\nPixeex is inspired by [PicThing](https://pic.ping.gg/login) by [Ping](https://ping.gg) and [Theo](https://t3.gg). Watch [video about PicThing](https://www.youtube.com/redirect?event=video_description&redir_token=QUFFLUhqbFBrR1pKLXJqSV93eFVwbjduZ3YzRkVRYmd0d3xBQ3Jtc0tuZ3pjWWxCUU8xYzhxd2M3N1g2eXZYdEM4WkYwWlBWNFVGUlZJMjAyQUxFZ2w3Q3lpQUFIYUx3RHlRRHdQNE1yMEVtTHEwODJBalo2YXJDTFY4MnRHd0ZEVlpwWEVwZXNaSEhtNlF6M3NhRkcwSVYtOA&q=https%3A%2F%2Ft3.gg%2F&v=x5hsXlqScYo) to see how it works.\n\nNote:\n\nThis project isn't a clone or a direct replacement for PicThing. When the video came out, RedwoodJS had just launched [Background Jobs](https://docs.redwoodjs.com/docs/background-jobs) and an upcoming Storage/Upload feature is in canary. We need a proper app to put these through its paces and PicThing inspired me to see if RedwoodJS could do it.\n\n\nIs this project different? Yes. The background removal is done differently using [birefnet on fal.ai](https://fal.ai/models/fal-ai/birefnet) and there is no image CDN and isn't as fast (but still pretty fast given the processing is done in background jobs).\n\nThe UX is different from what I can tell. I added albums to manage pics and a search and a \"tag-cloud-heat-map\" UI to show pics by tag.\n\nInstead of toggling the background removal on and off, I made it so you can download the background removed version or hover to see the original.\n\nWe have automatic image tagging using [Langbase](https://langbase.com/) [tagify-image-description PIPE](https://langbase.com/dthyresson/tagify-image-description) and based on a generated description via [florence-2-large on fal.ai](https://fal.ai/models/fal-ai/florence-2-large/more-detailed-caption).\n\nWe have automatic image tagging using [Langbase](https://langbase.com/) [tagify-image-description PIPE](https://langbase.com/dthyresson/tagify-image-description) and based on a generated description via [florence-2-large on fal.ai](https://fal.ai/models/fal-ai/florence-2-large/more-detailed-caption).\n\nThere's currently no user management or photos associated with the account. It can't copy paste yet either -- but it can download.\n\nThat said, it has a great set features and showcases the power of RedwoodJS for Jobs, Storage, Uploads, GraphQL, Realtime, and more.\n\n## Features\n\n- [x] Albums\n- [x] Upload images using RedwoodJS Storage\n- [x] Background removal using [birefnet on fal.ai](https://fal.ai/models/fal-ai/birefnet)\n- [x] RedwoodJS background jobs for:\n  - Background removal using [birefnet on fal.ai](https://fal.ai/models/fal-ai/birefnet)\n  - Image description using [florence-2-large on fal.ai](https://fal.ai/models/fal-ai/florence-2-large/more-detailed-caption)\n  - Automatic image tagging using [Langbase](https://www.langbase.com/)\n- [x] Real-time live query updates for processed images and tags\n- [x] Search functionality with pagination\n- [x] Download background removed image via function\n- [x] Dark mode support\n- [x] Rate limiting using [Unkey](https://unkey.com/)\n- [x] uuid generation using [The UX of UUIDs](https://www.unkey.com/blog/uuid-ux) pattern from [Unkey](https://unkey.com/)\n- [x] custom generator templates for SDL Codegen and Cells with custom lifecycle components\n- [x] QR code on server startup for easy mobile app access\n- [x] About page generation script `about.ts` with project README details with flow diagram\n\n## Technologies Used\n\n- [RedwoodJS](https://redwoodjs.com/) for the full stack framework with jobs, storage, uploads, and more\n- [Tailwind CSS](https://tailwindcss.com/) for styling\n- [Prisma](https://www.prisma.io/) for the database ORM\n- [GraphQL](https://graphql.org/) for the API\n- [Fal.ai](https://fal.ai/) for AI-powered background removal and image description\n- [Langbase](https://langbase.com/) for composable AI models used to generate image tags\n- [Unkey](https://unkey.com/) for rate limiting\n- [Cursor](https://cursor.com/) for AI-powered code generation\n\n## Getting Started\n\n1. Clone the repository\n2. Install dependencies: `yarn install`\n3. Set up your environment variables (see `.env.example`)\n4. Run database migrations: `yarn rw prisma migrate dev`\n5. Start the development server: `yarn rw dev`\n6. Run jobs: `yarn rw jobs work`\n\n## Project Structure\n\n- `api`: Backend API code\n- `web`: Frontend web application\n- `scripts`: Utility scripts\n- `api/src/services`: GraphQL resolvers and business logic\n- `api/src/graphql`: GraphQL schema definitions\n- `api/src/jobs`: Background job definitions\n- `web/src/components`: React components\n- `web/src/pages`: Page components and routing\n\n## Key Features\n\n### Image Upload and Processing\n\nImages can be uploaded to albums and are automatically processed in the background. The processing includes:\n\n1. Metadata extraction (EXIF data, dimensions, format)\n2. Background removal\n3. AI-powered image description\n4. Automatic tagging based on the description\n\n### Album Management\n\nUsers can create and manage multiple albums to organize their images.\n\n### Tagging System\n\nImages are automatically tagged based on their AI-generated descriptions, allowing for easy categorization and searching.\n\n### Dark Mode\n\nThe application supports both light and dark modes for user preference.\n\n### Flow Diagram\n\n```mermaid\ngraph TD\n    A[User uploads image] --> B[createPic mutation]\n    B --> C[Save image to storage]\n    C --> D[Create Pic record in database]\n    D --> E[Enqueue CreatePicFanOutJob]\n    E --> F[Remove Background Job]\n    E --> G[Extract Metadata Job]\n    E --> H[Describe Pic Job]\n    H --> I[Tag Image Job]\n\n    F --> J[Use fal.ai birefnet API]\n    J --> K[Update Pic with removed background]\n    K --> L[Send onBackgroundRemoved webhook]\n    L --> M[Invalidate Album live query]\n\n    G --> N[Use sharp for image metadata]\n    G --> O[Use exif-parser for EXIF data]\n    N --> P[Update Pic with metadata]\n    O --> P\n\n    H --> Q[Use fal.ai florence-2-large API]\n    Q --> R[Update Pic with description]\n\n    I --> S[Use Langbase PIPE for auto tagging]\n    S --> T[Update Pic with tags]\n    T --> U[Send onTagsCreated webhook]\n    U --> V[Invalidate Tags live query]\n```\n\nThis diagram illustrates the flow from image upload to the completion of all background jobs. Here's a brief explanation of each step:\n\n1. User uploads an image\n2. The `createPic` mutation is called\n3. The image is saved to storage\n4. A new Pic record is created in the database\n5. The `CreatePicFanOutJob` is enqueued\n6. Three jobs are enqueued by the `CreatePicFanOutJob`:\n   - Remove Background Job\n   - Describe Pic Job\n   - Extract Metadata Job\n7. The Tag Image Job runs after the Describe Pic Job completes\n8. Each job updates the Pic record with its respective results\n9. Webhooks are sent after background removal and tag creation to invalidate live queries\n\nNote: In the \"Use Langbase for tagging\" step, the application uses a custom prompt that is shown in `prompts/tagify-image-description.md`. This prompt instructs the AI to generate tags based on the image description, following specific rules for tag creation.\n\n### Job Queues and Priorities\n\nThe application uses RedwoodJS's job system to orchestrate the flow of image processing tasks. Different queues and priorities are used to ensure efficient processing:\n\n- The CreatePicFanOutJob runs on the 'critical' queue with priority 10.\n\n```10:13:api/src/jobs/CreatePicFanOutJob/CreatePicFanOutJob.ts\nexport const CreatePicFanOutJob = jobs.createJob({\n  queue: 'critical',\n  priority: 10,\n  perform: async (picId: string) => {\n```\n\n- The Remove Background Job runs on the 'critical' queue with priority 20.\n\n```13:16:api/src/jobs/RemoveImageBackgroundJob/RemoveImageBackgroundJob.ts\nexport const RemoveImageBackgroundJob = jobs.createJob({\n  queue: 'critical',\n  priority: 20,\n  perform: async (picId: string) => {\n```\n\n- The Describe Pic Job runs on the 'default' queue with priority 20.\n\n```10:13:api/src/jobs/DescribePicJob/DescribePicJob.ts\nexport const DescribePicJob = jobs.createJob({\n  queue: 'default',\n  priority: 20,\n  perform: async (picId: string) => {\n```\n\n- The Tag Image Job runs on the 'default' queue with priority 10.\n\n```12:15:api/src/jobs/TagifyPicJob/TagifyPicJob.ts\nexport const TagifyPicJob = jobs.createJob({\n  queue: 'default',\n  priority: 10,\n  perform: async (picId: string) => {\n```\n\n- The Extract Metadata Job runs on the 'default' queue with priority 30.\n\n```15:18:api/src/jobs/ProcessPicMetadataJob/ProcessPicMetadataJob.ts\nexport const ProcessPicMetadataJob = jobs.createJob({\n  queue: 'default',\n  priority: 30,\n  perform: async (picId: string) => {\n```\n\nThis setup allows for efficient resource utilization and ensures that critical jobs like background removal are processed quickly. The use of different queues and priorities ensures that faster jobs don't get blocked behind longer-running tasks. The use of webhooks for live query invalidation ensures that the UI stays up-to-date as jobs complete, providing a responsive user experience.\n\n## TODO (maybe)\n\n- [ ] Implement user authentication and authorization\n- [ ] Copy to clipboard button for image data\n- [ ] Add more advanced image editing features\n\n## Contributing\n\nContributions are welcome! Please feel free to submit a Pull Request.\n\n## Note\n\nThe About page is automatically generated using the `about.ts` script. This script reads the `README.md` file and generates a React component that is then used to render the About page. The flow diagram is generated using [Mermaid](https://mermaid.js.org/).\n"
          }
        </ReactMarkdown>
      </div>
    </>
  )
}

export default AboutPage
