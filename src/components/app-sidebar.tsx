'use client'

import * as React from 'react'
import { Command, Files, Home, LayoutDashboard, UserCog } from 'lucide-react'

import { NavUser } from '@/components/nav-user'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { Link, useLocation, useNavigate } from '@tanstack/react-router'
import useGetRequest from '@/hooks/use-get'
import type { Response } from '@/types/response'
import { Route } from '@/routes/__root'

export type NotificationPayload = {
  request_type: string
  assigned_by: number
  instructions: string | null
}

export type Notification = {
  id: number
  user_id: number
  document_id: number | null
  subject: string
  data: NotificationPayload
  is_read: boolean
  created_at: string
  updated_at: string
}

const navigationSidebar = [
  {
    title: 'Dashboard',
    url: '/',
    icon: LayoutDashboard,
    isActive: true,
  },
  {
    title: 'Documents',
    url: '/documents/document-management',
    icon: Files,
    isActive: false,
  },
  {
    title: 'Users',
    url: '/admin/user-management',
    icon: UserCog,
    isActive: false,
  },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const currentLocation = useLocation().pathname
  const { setOpen } = useSidebar()
  const navigate = useNavigate()
  const { authentication } = Route.useRouteContext()

  // Use directly instead of state
  const userRole = authentication.userRole()

  const [navMain, setNavMain] = React.useState(
    userRole === 'admin'
      ? navigationSidebar
      : navigationSidebar.filter((nav) => nav.title !== 'Users'),
  )

  // Fetch notifications
  const {
    data: notifications,
    isPending: isNotificationsPending,
    isError: isNotificationsError,
  } = useGetRequest<Response<Notification[]>>({
    url: '/api/notifications/limit',
    key: ['sidebarNotifications'],
  })

  /**
   * Adapt notifications -> mails UI shape
   */
  const mails = React.useMemo(() => {
    if (!notifications?.data) return []

    return notifications.data.map((notification) => ({
      name: 'System',
      email: `notification-${notification.id}`,
      subject: notification.subject,
      date: new Date(notification.created_at).toLocaleString(),
      teaser:
        notification.data?.instructions ??
        `${notification.data?.request_type ?? ''}`,
    }))
  }, [notifications])

  return (
    <Sidebar
      collapsible="icon"
      className="overflow-hidden *:data-[sidebar=sidebar]:flex-row z-20"
      {...props}
    >
      {/* ICON SIDEBAR */}
      <Sidebar
        collapsible="none"
        className="w-[calc(var(--sidebar-width-icon)+1px)]! border-r"
      >
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                size="lg"
                asChild
                className="h-10 max-md:w-10 md:h-8 md:p-0"
              >
                <Link to="/">
                  <img
                    src="/docusphere-icon.png"
                    alt="Icon"
                    className="w-full object-contain"
                  />
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent className="px-1.5 md:px-0">
              <SidebarMenu>
                {navMain.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      tooltip={{
                        children: item.title,
                        hidden: false,
                      }}
                      onClick={() => {
                        setOpen(true)
                        navigate({ to: item.url })
                      }}
                      isActive={currentLocation === item.url}
                      className={`px-2.5 md:px-2 data-[active=true]:bg-primary-blue data-[active=true]:text-primary-foreground`}
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <NavUser />
        </SidebarFooter>
      </Sidebar>

      {/* NOTIFICATIONS SIDEBAR */}
      <Sidebar collapsible="none" className="hidden flex-1 md:flex">
        <SidebarHeader className="gap-3.5 border-b p-4 pb-5">
          <div className="flex w-full items-center justify-between">
            <div className="text-foreground text-base font-medium">
              Docusphere DTS
            </div>
          </div>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup className="px-0">
            <SidebarGroupContent>
              {isNotificationsPending && (
                <div className="p-4 text-sm text-muted-foreground">
                  Loading notifications...
                </div>
              )}

              {isNotificationsError && (
                <div className="p-4 text-sm text-destructive">
                  Failed to load notifications
                </div>
              )}

              {notifications?.data && notifications.data.length === 0 && (
                <div className="p-4 text-sm text-muted-foreground">
                  No unread notifications
                </div>
              )}

              {notifications?.data &&
                notifications.data.length > 0 &&
                mails.map((mail) => (
                  <Link
                    to="/notifications"
                    key={mail.email}
                    className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex flex-col items-start gap-2 border-b p-4 text-sm leading-tight last:border-b-0"
                  >
                    <div className="flex w-full items-center gap-2">
                      <span>{mail.name}</span>
                      <span className="text-xs ml-auto">{mail.date}</span>
                    </div>
                    <span className="font-medium line-clamp-2">
                      {mail.subject}
                    </span>
                    <span className="line-clamp-2 w-full text-xs whitespace-break-spaces">
                      {mail.teaser}
                    </span>
                  </Link>
                ))}
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </Sidebar>
  )
}
