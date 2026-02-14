export type BlogPost = {
  slug: string
  title: string
  description: string
  tag: string
  date: string
  cover: string
  content: {
    heading: string
    paragraphs: string[]
    image?: string
  }[]
}

export const blogPosts: BlogPost[] = [
  {
    slug: "real-time-sync-with-supabase",
    title: "Building Real-Time Sync with Supabase",
    description:
      "How we implemented instant multi-tab synchronization using Supabase Realtime.",
    tag: "Engineering",
    date: "Jan 10, 2026",
    cover: "/blog/supabase-cover.jpg",
    content: [
      {
        heading: "Why Realtime Matters",
        paragraphs: [
          "Modern productivity tools must feel instantaneous.",
          "Users expect updates across devices without refreshing the page.",
          "Supabase Realtime allows us to subscribe to database changes and instantly reflect them in the UI."
        ],
        image: "/blog/realtime.jpg"
      },
      {
        heading: "Architecture Overview",
        paragraphs: [
          "We use Postgres as the source of truth.",
          "Row-level security ensures each user only receives their own events.",
          "WebSocket connections handle subscriptions efficiently."
        ],
        image: "/blog/architecture.jpg"
      }
    ]
  },
  {
    slug: "modern-bookmark-design",
    title: "Designing a Modern Bookmark Experience",
    description:
      "Why minimal design and performance matter in productivity tools.",
    tag: "Design",
    date: "Jan 5, 2026",
    cover: "/blog/design-cover.jpg",
    content: [
      {
        heading: "Minimalism with Purpose",
        paragraphs: [
          "Clutter destroys focus.",
          "We designed Smart Bookmark with whitespace and clarity in mind.",
          "Every visual element serves a functional role."
        ],
        image: "/blog/design.jpg"
      }
    ]
  },
  {
    slug: "authentication-architecture",
    title: "Security First: Our Authentication Architecture",
    description:
      "Deep dive into Google OAuth and row-level security.",
    tag: "Security",
    date: "Dec 28, 2025",
    cover: "/blog/security-cover.jpg",
    content: [
      {
        heading: "OAuth Strategy",
        paragraphs: [
          "We use Google OAuth to avoid password storage.",
          "Sessions are managed with HttpOnly cookies.",
          "All sensitive routes are protected with middleware."
        ],
        image: "/blog/security.jpg"
      }
    ]
  }
]
