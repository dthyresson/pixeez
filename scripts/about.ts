import fs from 'fs'
import { join } from 'path'

import { getPaths } from '@redwoodjs/project-config'

const generateAboutPage = async () => {
  try {
    // Read README.md
    const readmePath = join(process.cwd(), 'README.md')
    const readmeContent = await fs.readFileSync(readmePath, 'utf-8')

    // Generate React component
    const reactComponent = `
import { Metadata } from '@redwoodjs/web'
import ReactMarkdown from 'react-markdown'
import { Mermaid } from 'mdx-mermaid/Mermaid'

const AboutPage = () => {
  return (
    <>
      <Metadata
        title="About PicThang"
        description="About PicThang - A tribute to PicThing"
      />
      <div className="prose dark:prose-invert max-w-none">
        <ReactMarkdown
          components={{
            h1: ({ node, ...props }) => <h1 className="text-3xl font-bold my-4" {...props} />,
            h2: ({ node, ...props }) => <h2 className="text-2xl font-semibold my-4" {...props} />,
            h3: ({ node, ...props }) => <h3 className="text-xl font-medium my-4" {...props} />,
            ul: ({ node, ...props }) => <ul className="list-disc pl-5 my-4" {...props} />,
            ol: ({ node, ...props }) => <ol className="list-decimal pl-5 my-4" {...props} />,
            p: ({ node, ...props }) => <p className="my-4" {...props} />,
            a: ({ node, ...props }) => <a className="text-purple-600 dark:text-purple-400 underline hover:text-purple-500 dark:hover:text-purple-300" {...props} />,
            code: ({ node, inline, className, children, ...props }) => {
              const match = /language-(\\w+)/.exec(className || '')
              if (!inline && match && match[1] === 'mermaid') {
                return <Mermaid chart={String(children).replace(/\\\\n/g, '\\n')} />
              }
              return <code className="bg-purple-200 dark:text-white dark:bg-purple-800 rounded p-1 my-2" {...props}>{children}</code>
            },
          }}
        >
          {${JSON.stringify(readmeContent)}}
        </ReactMarkdown>
      </div>
    </>
  )
}

export default AboutPage
`

    // Write to AboutPage.tsx
    const aboutPagePath = join(
      getPaths().web.src,
      'pages',
      'AboutPage',
      'AboutPage.tsx'
    )
    fs.writeFileSync(aboutPagePath, reactComponent)

    console.log('AboutPage.tsx has been generated successfully.')
  } catch (error) {
    console.error('Error generating AboutPage:', error)
  }
}

export default async () => {
  await generateAboutPage()
}
