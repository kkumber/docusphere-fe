import { BadgeCheck, Bell, ChevronsUpDown, LogOut } from 'lucide-react'
import { Link } from '@tanstack/react-router'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import useLogoutUser from '@/hooks/use-logout'
import ErrorDialog from './error-dialog'
import type { User } from '@/types/user'
import { useUserContext } from '@/context/user-context'

export function NavUser() {
  const { isMobile } = useSidebar()
  const mutation = useLogoutUser()
  const { user, setUser } = useUserContext()

  const handleLogout = () => {
    mutation.mutate()
    mutation.reset()
    setUser(null)
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        {!user ? (
          <SidebarMenuButton size="lg" className="md:h-8 md:p-0">
            <div className="h-8 w-8 rounded-lg bg-muted animate-pulse" />
            <div className="flex-1 space-y-1">
              <div className="h-3 w-24 bg-muted rounded animate-pulse" />
              <div className="h-2 w-32 bg-muted rounded animate-pulse" />
            </div>
          </SidebarMenuButton>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground md:h-8 md:p-0"
              >
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarFallback className="rounded-lg">
                    {user.first_name.charAt(0) + user.last_name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">
                    {user.first_name} {user.last_name}
                  </span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
                <ChevronsUpDown className="ml-auto size-4" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
              side={isMobile ? 'bottom' : 'right'}
              align="end"
              sideOffset={4}
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarFallback className="rounded-lg">
                      {user.first_name.charAt(0) + user.last_name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">
                      {user.first_name} {user.last_name}
                    </span>
                    <span className="truncate text-xs">{user.email}</span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                  <Link
                    to="/account/$userId/details"
                    params={{ userId: user.id.toString() }}
                  >
                    <BadgeCheck />
                    Account
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/notifications">
                    <Bell />
                    Notifications
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              {/* Log Out */}
              <DropdownMenuItem
                onClick={handleLogout}
                disabled={mutation.isPending}
              >
                <LogOut />
                {mutation.isPending ? 'Logging out...' : 'Log out'}
              </DropdownMenuItem>
              {mutation.isError && (
                <ErrorDialog
                  title="Error"
                  description={mutation.error.message}
                  open={mutation.isError}
                  onOpenChange={mutation.reset}
                />
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
