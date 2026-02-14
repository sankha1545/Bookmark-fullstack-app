import { format } from "date-fns"

export function safeDate(value: any, formatStr: string) {
  if (!value) return "—"
  const d = new Date(value)
  if (isNaN(d.getTime())) return "—"
  return format(d, formatStr)
}
