import { Link, routes } from '@redwoodjs/router'
import { Toaster } from '@redwoodjs/web/toast'

import DarkModeToggle from 'src/components/DarkModeToggle/DarkModeToggle'

type MainLayoutProps = {
  children?: React.ReactNode
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="h-full dark:bg-black dark:text-white">
      <div className="container mx-auto p-12">
        <Toaster />
        <main>
          <nav className="mb-4 flex items-center justify-between border-b border-gray-200 pb-4 dark:border-gray-800">
            <Link to={routes.albums()}>
              <h1 className="text-3xl font-bold">
                <span className="text-purple-600">pic</span>
                <span className="text-gray-300 dark:text-white">thang</span>
              </h1>
            </Link>
            <div className="flex items-center gap-4">
              <Link
                className="rounded-full bg-gray-200 p-2 dark:bg-gray-700"
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
    </div>
  )
}

export default MainLayout
