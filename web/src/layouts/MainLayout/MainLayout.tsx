import { Link, routes } from '@redwoodjs/router'
import { Toaster } from '@redwoodjs/web/toast'

import DarkModeToggle from 'src/components/DarkModeToggle/DarkModeToggle'

type MainLayoutProps = {
  children?: React.ReactNode
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="flex min-h-screen flex-col dark:bg-black dark:text-white">
      <div className="container mx-auto flex-grow p-12">
        <Toaster />
        <main>
          <nav className="mb-4 flex items-center justify-between border-b border-neutral-200 pb-4 dark:border-neutral-800">
            <Link to={routes.albums()}>
              <h1 className="text-3xl font-bold">
                <span className="text-purple-600">pic</span>
                <span className="text-neutral-300 dark:text-white">thang</span>
              </h1>
            </Link>
            <div className="flex items-center gap-4">
              <Link
                className="rounded-full bg-neutral-200 p-2 dark:bg-neutral-700"
                to={routes.search()}
              >
                🔎
              </Link>
              <Link
                className="rounded-full bg-neutral-200 p-2 dark:bg-neutral-700"
                to={routes.tags()}
              >
                🏷️
              </Link>

              <Link
                className="rounded-full bg-neutral-200 p-2 dark:bg-neutral-700"
                to={routes.about()}
              >
                🙋
              </Link>
              <DarkModeToggle />
            </div>
          </nav>
          {children}
        </main>
      </div>
      <footer className="container mx-auto border-t border-neutral-200 p-4 dark:border-neutral-800">
        <div className="flex justify-between gap-2">
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Made with ❤️ by <a href="https://www.thyresson.io">DT</a>
          </p>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            <a href="https://github.com/dthyresson/pic-thang">View on GitHub</a>
          </p>
        </div>
      </footer>
    </div>
  )
}

export default MainLayout
