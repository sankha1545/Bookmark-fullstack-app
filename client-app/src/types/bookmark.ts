export type Bookmark = {
  id: string
  title: string
  url: string
  tags?: string[]        // ✅ remove null
  note?: string          // ✅ remove null
  favourite: boolean
  created_at: string
}
