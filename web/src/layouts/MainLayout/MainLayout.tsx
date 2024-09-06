import { Toaster } from '@redwoodjs/web/toast'

type MainLayoutProps = {
  children?: React.ReactNode
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="container mx-auto p-12">
      <Toaster />
      <main>{children}</main>
    </div>
  )
}

export default MainLayout
