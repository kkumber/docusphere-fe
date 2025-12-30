export function validateDueDate(dueDate: Date) {
    // 1. Get current date and set it to the very beginning of today (midnight)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const selectedDate = new Date(dueDate)

    // 3. Validation Logic
    if (selectedDate < today) {
      return false;
    }

    return true;
}