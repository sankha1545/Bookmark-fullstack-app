import { render, screen, fireEvent } from "@testing-library/react"
import DeleteBookmarkModal from "../DeleteBookmarkModal"

describe("DeleteBookmarkModal", () => {
  const mockBookmark = {
    id: "1",
    title: "Google",
  }

  const mockOnClose = jest.fn()
  const mockOnConfirm = jest.fn()

  const renderModal = () =>
    render(
      <DeleteBookmarkModal
        open={true}
        bookmark={mockBookmark}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
      />
    )

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test("renders modal with correct title", () => {
    renderModal()

    // Match text more flexibly
    expect(
      screen.getByText((content) =>
        content.includes("Google")
      )
    ).toBeInTheDocument()
  })

  test("calls onClose when Cancel is clicked", () => {
    renderModal()

    const cancelButton = screen.getByRole("button", {
      name: /cancel/i,
    })

    fireEvent.click(cancelButton)

    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  test("calls onConfirm when Delete is clicked", () => {
    renderModal()

    const deleteButton = screen.getByRole("button", {
      name: /delete/i,
    })

    fireEvent.click(deleteButton)

    expect(mockOnConfirm).toHaveBeenCalledTimes(1)
  })
})
