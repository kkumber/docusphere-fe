import { SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import type { Breadcrumbs } from '@/types/ui'

interface BreadcrumbItems {
  breadcrumbs: Breadcrumbs[]
}

export default function Header({ breadcrumbs }: BreadcrumbItems) {
  return (
    <header className="bg-background sticky top-0 flex shrink-0 items-center gap-2 border-b p-4 z-50">
      <SidebarTrigger className="-ml-1" />
      <Separator
        orientation="vertical"
        className="mr-2 data-[orientation=vertical]:h-4"
      />
      <Breadcrumb>
        <BreadcrumbList>
          {breadcrumbs.map((breadcrumb, index) => (
            <>
              {breadcrumbs.length - 1 === index ? (
                <BreadcrumbItem className="block" key={index}>
                  <BreadcrumbPage>{breadcrumb.title}</BreadcrumbPage>
                </BreadcrumbItem>
              ) : (
                <>
                  <BreadcrumbItem className="block" key={index}>
                    <BreadcrumbLink href={breadcrumb.href}>
                      {breadcrumb.title}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="block" />
                </>
              )}
            </>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </header>
  )
}
