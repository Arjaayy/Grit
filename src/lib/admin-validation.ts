export function validateEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

export function validatePhone(phone: string): boolean {
  const re = /^\(\d{3}\) \d{3}-\d{4}$/
  return re.test(phone)
}

export function validateUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

export function validateCurrency(value: string): boolean {
  const num = Number(value)
  return !Number.isNaN(num) && num >= 0 && Number.isFinite(num)
}

export function validateDate(date: string): boolean {
  const d = new Date(date)
  return !Number.isNaN(d.getTime())
}

export function validateRequired(value: unknown): boolean {
  return value != null && String(value).trim().length > 0
}
