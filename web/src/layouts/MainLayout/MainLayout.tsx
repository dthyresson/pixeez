import {
  MagnifyingGlassIcon,
  TagIcon,
  HandRaisedIcon,
} from '@heroicons/react/24/solid'

import { Link, routes } from '@redwoodjs/router'
import { Toaster } from '@redwoodjs/web/toast'

import DarkModeToggle from 'src/components/DarkModeToggle/DarkModeToggle'

type MainLayoutProps = {
  children?: React.ReactNode
}

const NavBar = () => {
  return (
    <nav className="mb-4 flex items-center justify-between border-b border-neutral-200 pb-4 dark:border-neutral-800">
      <Link to={routes.albums()}>
        <h1 className="text-3xl font-bold">
          <span className="text-purple-600">pic</span>
          <span className="text-neutral-300 dark:text-white">thang</span>
        </h1>
      </Link>
      <div className="flex items-center gap-4">
        <Link
          className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-300 text-lg hover:bg-neutral-400 dark:bg-neutral-300 dark:hover:bg-neutral-400"
          to={routes.search()}
        >
          <MagnifyingGlassIcon className="h-4 w-4 text-purple-600" />
        </Link>
        <Link
          className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-300 text-lg hover:bg-neutral-400 dark:bg-neutral-300 dark:hover:bg-neutral-400"
          to={routes.tags()}
        >
          <TagIcon className="h-4 w-4 text-purple-600" />
        </Link>
        <Link
          className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-300 text-lg hover:bg-neutral-400 dark:bg-neutral-300 dark:hover:bg-neutral-400"
          to={routes.about()}
        >
          <HandRaisedIcon className="h-4 w-4 text-purple-600" />
        </Link>
        <DarkModeToggle />
      </div>
    </nav>
  )
}

const Footer = () => {
  return (
    <footer className="container mx-auto mt-8 border-t border-purple-200 p-4 dark:border-neutral-800">
      <div className="flex justify-between gap-2">
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Made with 💜 by{' '}
          <a
            href="https://www.thyresson.io"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-purple-500"
          >
            DT
          </a>{' '}
          with 🌲{' '}
          <a
            href="https://redwoodjs.com"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-purple-500"
          >
            RedwoodJS
          </a>
        </p>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          <a
            href="https://github.com/dthyresson/pic-thang"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-purple-500"
          >
            View on GitHub
          </a>
        </p>
      </div>
    </footer>
  )
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="flex min-h-screen flex-col border-t-4 border-purple-600 dark:bg-black dark:text-white">
      <Toaster />
      <div className="container mx-auto flex-grow px-8 pt-4">
        <NavBar />
        <main>{children}</main>
      </div>
      <Footer />
    </div>
  )
}

export default MainLayout
