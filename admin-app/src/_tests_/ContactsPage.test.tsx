import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import ContactsPage from "@/src/app/(protected)/contacts/page"

jest.mock("@supabase/supabase-js", () => ({
  createClient: () => ({
    from: () => ({
      select: () => ({
        order: async () => ({
          data: [],
          error: null,
        }),
      }),
      update: () => ({
        eq: async () => ({
          error: null,
        }),
      }),
    }),
  }),
}))

const mockMessages = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    country: "USA",
    state: "California",
    dial_code: "+1",
    phone: "1234567890",
    message: "Hello there!",
    created_at: new Date().toISOString(),
    is_read: false,
  },
  {
    id: "2",
    name: "Alice",
    email: "alice@example.com",
    country: "UK",
    state: "London",
    dial_code: "+44",
    phone: "999999999",
    message: "Need help",
    created_at: new Date().toISOString(),
    is_read: true,
  },
]

describe("Contacts Page Integration", () => {

  it("renders all messages", async () => {
    render(<ContactsPage initialMessages={mockMessages} />)

    await screen.findByText("John Doe")
    expect(screen.getByText("Alice")).toBeInTheDocument()
  })

  it("shows empty state when no messages", async () => {
    render(<ContactsPage initialMessages={[]} />)

    await screen.findByText(/no messages/i)
  })

  it("marks message as read", async () => {
    const user = userEvent.setup()

    render(<ContactsPage initialMessages={mockMessages} />)

    const button = await screen.findByRole("button", {
      name: /mark as read/i,
    })

    await user.click(button)

    expect(screen.queryByText("New")).not.toBeInTheDocument()
  })

})
