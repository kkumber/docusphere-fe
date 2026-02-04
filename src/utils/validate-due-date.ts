export function validateDueDate(dueDate: string): boolean {
  const today = new Date()
  const todayDateOnly = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  )

  const [year, month, day] = dueDate.split('-').map(Number)
  const selectedDateOnly = new Date(year, month - 1, day)

  return selectedDateOnly >= todayDateOnly
}

export function formatLocalDate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}