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
    <nav className="mb-4 flex items-center justify-between border-b border-pink-400 pb-4 dark:border-pink-400">
      <Link to={routes.albums()}>
        <h1 className="text-3xl font-bold">
          <img src="/logo.png" alt="Pixeez" className="h-20 w-auto" />
        </h1>
      </Link>
      <div className="flex items-center gap-2">
        <Link
          className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-teal-600 bg-white text-lg hover:bg-teal-100 dark:bg-teal-900 dark:hover:bg-teal-700"
          to={routes.search()}
        >
          <MagnifyingGlassIcon className="h-4 w-4 text-teal-600" />
        </Link>
        <Link
          className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-cyan-600 bg-white text-lg hover:bg-cyan-100 dark:bg-cyan-900 dark:hover:bg-cyan-700"
          to={routes.tags()}
        >
          <TagIcon className="h-4 w-4 text-cyan-600" />
        </Link>
        <Link
          className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-violet-600 bg-white text-lg hover:bg-violet-100 dark:bg-violet-900 dark:hover:bg-violet-700"
          to={routes.about()}
        >
          <HandRaisedIcon className="h-4 w-4 text-violet-600" />
        </Link>
        <DarkModeToggle />
      </div>
    </nav>
  )
}

const Footer = () => {
  return (
    <footer className="container mx-auto mt-8 border-t border-sky-400 p-4 dark:border-sky-800">
      <div className="flex justify-between gap-2">
        <p className="text-sm text-sky-500 dark:text-sky-400">
          Made with 💜 by{' '}
          <a
            href="https://www.thyresson.io"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-sky-500"
          >
            DT
          </a>{' '}
          with 🌲{' '}
          <a
            href="https://skywoodjs.com"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-sky-500"
          >
            RedwoodJS
          </a>
        </p>
        <p className="text-sm text-sky-500 dark:text-sky-400">
          <a
            href="https://github.com/dthyresson/pic-thang"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-sky-500"
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
    <div className="flex min-h-screen flex-col border-t-4 border-teal-600 bg-amber-100 dark:bg-amber-300 dark:text-white">
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
