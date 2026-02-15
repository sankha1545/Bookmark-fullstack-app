export type Bookmark = {
  id: string
  title: string
  url: string
  tags?: string[] | null
  note?: string | null   // ✅ ADD THIS
  favourite: boolean
  created_at: string
}
