import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import UserProfileClient from "@/src/app/(protected)/users/[id]/UserProfileClient"

// 🔥 Mock modal (avoid Radix issues)
jest.mock("@/src/app/(protected)/users/[id]/BookmarkModal", () => ({
  __esModule: true,
  default: ({ bookmark }: any) =>
    bookmark ? <div data-testid="bookmark-modal">Modal Open</div> : null,
}))

// 🔥 Mock filters (we test logic, not UI internals)
jest.mock("@/src/app/(protected)/users/[id]/BookmarkFilters", () => ({
  __esModule: true,
  default: ({ setSearch }: any) => (
    <input
      placeholder="Search bookmarks..."
      onChange={(e) => setSearch(e.target.value)}
    />
  ),
}))

describe("UserProfileClient", () => {
  const mockUser = {
    display_name: "John Doe",
    email: "john@example.com",
    country: "India",
  }

  const mockBookmarks = [
    {
      id: "1",
      title: "Google",
      url: "https://google.com",
      created_at: "2024-01-01",
    },
    {
      id: "2",
      title: "Apple",
      url: "https://apple.com",
      created_at: "2024-02-01",
    },
  ]

  it("renders user info", () => {
    render(
      <UserProfileClient user={mockUser} bookmarks={mockBookmarks} />
    )

    expect(screen.getByText("John Doe")).toBeInTheDocument()
    expect(screen.getByText("john@example.com")).toBeInTheDocument()
  })

  it("renders bookmarks", () => {
    render(
      <UserProfileClient user={mockUser} bookmarks={mockBookmarks} />
    )

    expect(screen.getByText("Google")).toBeInTheDocument()
    expect(screen.getByText("Apple")).toBeInTheDocument()
  })

  it("filters bookmarks by search", async () => {
    const user = userEvent.setup()

    render(
      <UserProfileClient user={mockUser} bookmarks={mockBookmarks} />
    )

    const input = screen.getByPlaceholderText("Search bookmarks...")
    await user.type(input, "Apple")

    expect(screen.queryByText("Google")).not.toBeInTheDocument()
    expect(screen.getByText("Apple")).toBeInTheDocument()
  })

  it("opens modal when bookmark clicked", async () => {
    const user = userEvent.setup()

    render(
      <UserProfileClient user={mockUser} bookmarks={mockBookmarks} />
    )

    await user.click(screen.getByText("Google"))

    expect(
      screen.getByTestId("bookmark-modal")
    ).toBeInTheDocument()
  })

  it("clears filters", async () => {
    const user = userEvent.setup()

    render(
      <UserProfileClient user={mockUser} bookmarks={mockBookmarks} />
    )

    const input = screen.getByPlaceholderText("Search bookmarks...")
    await user.type(input, "Google")

    const clearButton = screen.getByRole("button", {
      name: /clear filters/i,
    })

    await user.click(clearButton)

    expect(screen.getByText("Google")).toBeInTheDocument()
    expect(screen.getByText("Apple")).toBeInTheDocument()
  })
})
