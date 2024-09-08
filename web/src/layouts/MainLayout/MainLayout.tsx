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
        <div className="mb-4 flex justify-end">
          <DarkModeToggle />
        </div>
        <main>{children}</main>
      </div>
    </div>
  )
}

export default MainLayout
