import officesData from '@/departments.json'


export interface SubDepartment {
  name: string
  roles: string[]
}

export  interface Department {
  name: string
  roles?: string[]
  sub_departments?: SubDepartment[]
}

export interface Office {
  name: string
  roles?: string[]
  departments?: Department[]
}

export const DEMO_ACCOUNTS = ['docusphere@admin.com', 'docusphere@staff.com', 'docusphere@sds.com', 'docusphere@chief.com', 'docusphere@records.com'];


export function getOffices(): Office[] {
  return (officesData.Offices as Office[])
}

/** Collect all department / sub-department names that belong to an office. */
export function getDepartmentsForOffice(officeName: string): string[] {
  const office = (officesData.Offices as Office[]).find(
    (o) => o.name === officeName,
  )
  if (!office) return []

  const names: string[] = []

  if (office.departments) {
    for (const dept of office.departments) {
      names.push(dept.name)
      if (dept.sub_departments) {
        for (const sub of dept.sub_departments) {
          names.push(sub.name)
        }
      }
    }
  }

  return names
}

/** Collect all role strings that belong to a given department (or sub-department) within an office. */
export function getDesignationsForDepartment(
  officeName: string,
  departmentName: string,
): string[] {
  const office = (officesData.Offices as Office[]).find(
    (o) => o.name === officeName,
  )
  if (!office || !office.departments) return []

  for (const dept of office.departments) {
    if (dept.name === departmentName) {
      return dept.roles ?? []
    }
    if (dept.sub_departments) {
      for (const sub of dept.sub_departments) {
        if (sub.name === departmentName) {
          return sub.roles
        }
      }
    }
  }

  return []
}

/** Strip multiplicity suffixes like " (3)" so we get clean role names. */
export function parseRoles(roles: string[]): string[] {
  const result: string[] = []
  for (const raw of roles) {
    const match = raw.match(/^(.+?)\s*\((\d+)\)$/)
    if (match) {
      const count = parseInt(match[2], 10)
      for (let i = 1; i <= count; i++) {
        result.push(count === 1 ? match[1] : `${match[1]} ${i}`)
      }
    } else {
      result.push(raw)
    }
  }
  return result
}
