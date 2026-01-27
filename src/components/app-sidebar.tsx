'use client'

import * as React from 'react'
import { Command, Files, LayoutDashboard, UserCog } from 'lucide-react'

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
import { Link, useNavigate } from '@tanstack/react-router'
import useGetRequest from '@/hooks/use-get'
import type { Response } from '@/types/response'

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

const data = {
  navMain: [
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
      title: 'User Management',
      url: '/admin/user-management',
      icon: UserCog,
      isActive: false,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [activeItem, setActiveItem] = React.useState(data.navMain[0])
  const { setOpen } = useSidebar()
  const navigate = useNavigate()

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
        `Request type: ${notification.data?.request_type ?? 'N/A'}`,
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
              <SidebarMenuButton size="lg" asChild className="md:h-8 md:p-0">
                <a href="#">
                  <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                    <Command className="size-4" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">Docusphere</span>
                    <span className="truncate text-xs">
                      Document Tracking System
                    </span>
                  </div>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent className="px-1.5 md:px-0">
              <SidebarMenu>
                {data.navMain.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      tooltip={{
                        children: item.title,
                        hidden: false,
                      }}
                      onClick={() => {
                        setActiveItem(item)
                        setOpen(true)
                        navigate({ to: item.url })
                      }}
                      isActive={activeItem?.title === item.title}
                      className="px-2.5 md:px-2"
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
                  No notifications
                </div>
              )}

              {notifications?.data &&
                notifications.data.length > 0 &&
                mails.map((mail) => (
                  <Link
                    to="/documents/document-management"
                    key={mail.email}
                    className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex flex-col items-start gap-2 border-b p-4 text-sm leading-tight last:border-b-0"
                  >
                    <div className="flex w-full items-center gap-2">
                      <span>{mail.name}</span>
                      <span className="ml-auto text-xs">{mail.date}</span>
                    </div>
                    <span className="font-medium">{mail.subject}</span>
                    <span className="line-clamp-2 w-[260px] text-xs whitespace-break-spaces">
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
