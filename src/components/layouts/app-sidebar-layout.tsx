import { useUserContext } from '@/context/user-context'
import { AppSidebar } from '@/components/app-sidebar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'

interface ChildrenProps {
  children: React.ReactNode
}

const AppSidebarLayout = ({ children }: ChildrenProps) => {
  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>{children}</SidebarInset>
      </SidebarProvider>
    </>
  )
}

export default AppSidebarLayout
