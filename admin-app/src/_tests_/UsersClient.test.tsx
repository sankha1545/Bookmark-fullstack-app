import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import UsersClient from "@/src/app/(protected)/users/UsersClient"

// 🔥 Mock next/link
jest.mock("next/link", () => {
  return ({ children }: any) => <div>{children}</div>
})

// 🔥 Mock framer-motion
jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children }: any) => <div>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <div>{children}</div>,
}))

// 🔥 Mock UsersFilters (so we can trigger setters manually)
jest.mock(
  "@/src/app/(protected)/users/UsersFilters",
  () => (props: any) => (
    <div>
      <button onClick={() => props.setSearchQuery("john")}>
        Trigger Search
      </button>
      <button onClick={() => props.setSortBy("az")}>
        Trigger Sort AZ
      </button>
      <button onClick={props.onClear}>
        Trigger Clear
      </button>
    </div>
  )
)

// 🔥 Mock Pagination
jest.mock(
  "@/src/app/(protected)/users/UsersPagination",
  () => (props: any) => (
    <div>
      <button onClick={() => props.setCurrentPage(2)}>
        Go Page 2
      </button>
    </div>
  )
)

describe("UsersClient", () => {
  const users = [
    {
      auth_user_id: "1",
      profile_id: null,
      display_name: "John Doe",
      email: "john@example.com",
      auth_created_at: "2024-01-01",
      bookmarkCount: 5,
    },
    {
      auth_user_id: "2",
      profile_id: null,
      display_name: "Alice",
      email: "alice@example.com",
      auth_created_at: "2024-02-01",
      bookmarkCount: 10,
    },
  ]

  it("renders initial users", () => {
    render(<UsersClient initialUsers={users} />)

    expect(screen.getByText("John Doe")).toBeInTheDocument()
    expect(screen.getByText("Alice")).toBeInTheDocument()
  })

  it("filters users by search", async () => {
    const user = userEvent.setup()
    render(<UsersClient initialUsers={users} />)

    await user.click(screen.getByText("Trigger Search"))

    expect(screen.getByText("John Doe")).toBeInTheDocument()
    expect(screen.queryByText("Alice")).not.toBeInTheDocument()
  })

it("sorts users A-Z", async () => {
  const user = userEvent.setup()
  render(<UsersClient initialUsers={users} />)

  await user.click(screen.getByText("Trigger Sort AZ"))

  const userNames = screen.getAllByText(/John Doe|Alice/)

  expect(userNames[0]).toHaveTextContent("Alice")
  expect(userNames[1]).toHaveTextContent("John Doe")
})



  it("clears filters", async () => {
    const user = userEvent.setup()
    render(<UsersClient initialUsers={users} />)

    await user.click(screen.getByText("Trigger Search"))
    await user.click(screen.getByText("Trigger Clear"))

    expect(screen.getByText("Alice")).toBeInTheDocument()
    expect(screen.getByText("John Doe")).toBeInTheDocument()
  })
})
