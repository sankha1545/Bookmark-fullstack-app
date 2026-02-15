import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import ContactCard from "@/src/components/contacts/ContactCard"

const mockMessage = {
  id: "msg-1",
  name: "John Doe",
  email: "john@example.com",
  country: "USA",
  state: "California",
  dial_code: "+1",
  phone: "1234567890",
  message: "Hello there!",
  created_at: new Date().toISOString(),
  is_read: false,
}

describe("ContactCard", () => {
  const setup = (overrides = {}) => {
    const onMarkAsRead = jest.fn()

    render(
      <ContactCard
        message={{ ...mockMessage, ...overrides }}
        onMarkAsRead={onMarkAsRead}
      />
    )

    return { onMarkAsRead }
  }

  it("renders contact information correctly", () => {
    setup()

    expect(screen.getByText("John Doe")).toBeInTheDocument()
    expect(screen.getByText("john@example.com")).toBeInTheDocument()
    expect(screen.getByText("USA")).toBeInTheDocument()
    expect(screen.getByText("California")).toBeInTheDocument()
    expect(screen.getByText("Hello there!")).toBeInTheDocument()
  })

  it("shows 'New' badge when message is unread", () => {
    setup({ is_read: false })

    expect(screen.getByText("New")).toBeInTheDocument()
  })

  it("does not show 'New' badge when message is read", () => {
    setup({ is_read: true })

    expect(screen.queryByText("New")).not.toBeInTheDocument()
  })

  it("calls onMarkAsRead when button is clicked", async () => {
    const user = userEvent.setup()
    const { onMarkAsRead } = setup({ is_read: false })

    const button = screen.getByRole("button", { name: /mark as read/i })
    await user.click(button)

    expect(onMarkAsRead).toHaveBeenCalledTimes(1)
    expect(onMarkAsRead).toHaveBeenCalledWith("msg-1")
  })
})
