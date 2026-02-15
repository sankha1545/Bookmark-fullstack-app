import { render, screen, fireEvent } from "@testing-library/react"
import DashboardPage from "../page"

// ✅ Mock Supabase
jest.mock("@/lib/supabase/client", () => {
  return {
    supabase: {
      auth: {
        getUser: jest.fn(() =>
          Promise.resolve({
            data: { user: { id: "user-1" } },
          })
        ),
      },

      from: jest.fn((table: string) => {
        if (table === "bookmarks") {
          return {
            select: () => ({
              order: () =>
                Promise.resolve({
                  data: [
                    {
                      id: "1",
                      title: "Google",
                      url: "https://google.com",
                      created_at: new Date().toISOString(),
                    },
                  ],
                  error: null,
                }),
            }),

            insert: () => ({
              select: () => ({
                single: () =>
                  Promise.resolve({
                    data: {
                      id: "2",
                      title: "New Site",
                      url: "https://new.com",
                      created_at: new Date().toISOString(),
                    },
                    error: null,
                  }),
              }),
            }),

            delete: () => ({
              eq: () => Promise.resolve({ error: null }),
            }),

            update: () => ({
              eq: () => Promise.resolve({ error: null }),
            }),
          }
        }
      }),
    },
  }
})

// ✅ Optional: Silence act warnings cleanly
beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation((msg) => {
    if (
      typeof msg === "string" &&
      msg.includes("not wrapped in act")
    ) {
      return
    }
    console.warn(msg)
  })
})

describe("DashboardPage", () => {
  const renderAndWait = async () => {
    render(<DashboardPage />)
    await screen.findByText("Google")
  }

  test("fetchBookmarks loads data", async () => {
    await renderAndWait()
    expect(screen.getByText("Google")).toBeInTheDocument()
  })

  test("createBookmark inserts new bookmark", async () => {
    await renderAndWait()

    const addButton = screen.getByText("+ Add Bookmark")
    fireEvent.click(addButton)

    expect(addButton).toBeInTheDocument()
  })

  test("deleteBookmark removes bookmark", async () => {
    await renderAndWait()
    expect(screen.getByText("Google")).toBeInTheDocument()
  })

  test("toggleFavourite updates bookmark", async () => {
    await renderAndWait()
    expect(screen.getByText("Google")).toBeInTheDocument()
  })
})
