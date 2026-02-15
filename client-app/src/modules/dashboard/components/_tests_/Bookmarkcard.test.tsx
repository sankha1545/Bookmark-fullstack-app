import { render, screen, fireEvent } from "@testing-library/react"
import BookmarkCard from "../BookmarkCard"

const mockBookmark = {
  id: "1",
  title: "Google",
  url: "https://google.com",
  created_at: new Date().toISOString(),
  favourite: false,
}

describe("BookmarkCard", () => {
  const onEdit = jest.fn()
  const onDelete = jest.fn()
  const onToggleFavourite = jest.fn()

  const renderComponent = () =>
    render(
      <BookmarkCard
        bookmark={mockBookmark}
        onEdit={onEdit}
        onDelete={onDelete}
        onToggleFavourite={onToggleFavourite}
      />
    )

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test("renders bookmark title and url", () => {
    renderComponent()

    expect(screen.getByText("Google")).toBeInTheDocument()
    expect(screen.getByText("https://google.com")).toBeInTheDocument()
  })

  test("calls onEdit when edit button clicked", () => {
    renderComponent()

    const editButton = screen.getByRole("button", { name: /edit/i })
    fireEvent.click(editButton)

    expect(onEdit).toHaveBeenCalledTimes(1)
  })

  test("calls onDelete when delete button clicked", () => {
    renderComponent()

    const deleteButton = screen.getByRole("button", { name: /delete/i })
    fireEvent.click(deleteButton)

    expect(onDelete).toHaveBeenCalledTimes(1)
  })

  test("calls onToggleFavourite when favourite button clicked", () => {
    renderComponent()

    const favButton = screen.getByRole("button", { name: /favourite/i })
    fireEvent.click(favButton)

    expect(onToggleFavourite).toHaveBeenCalledTimes(1)
  })
})
