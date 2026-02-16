import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import UsersFilters from "@/src/app/(protected)/users/UsersFilters"


jest.mock("@/src/components/ui/select", () => ({
  Select: ({ children, onValueChange }: any) => (
    <div>
      <button onClick={() => onValueChange("az")}>
        Mock Select
      </button>
      {children}
    </div>
  ),
  SelectTrigger: ({ children }: any) => <div>{children}</div>,
  SelectContent: ({ children }: any) => <div>{children}</div>,
  SelectItem: ({ children }: any) => <div>{children}</div>,
  SelectValue: ({ children }: any) => <div>{children}</div>,
}))

describe("UsersFilters", () => {
  const setup = () => {
    const setSearchQuery = jest.fn()
    const setSortBy = jest.fn()
    const setStartDate = jest.fn()
    const setEndDate = jest.fn()
    const onClear = jest.fn()

    render(
      <UsersFilters
        searchQuery=""
        setSearchQuery={setSearchQuery}
        sortBy="newest"
        setSortBy={setSortBy}
        startDate=""
        setStartDate={setStartDate}
        endDate=""
        setEndDate={setEndDate}
        onClear={onClear}
      />
    )

    return {
      setSearchQuery,
      setSortBy,
      setStartDate,
      setEndDate,
      onClear,
    }
  }

  it("updates search input", async () => {
    const user = userEvent.setup()
    const { setSearchQuery } = setup()

    const input = screen.getByPlaceholderText("Search users...")
    await user.type(input, "john")

    expect(setSearchQuery).toHaveBeenCalled()
  })

 it("updates sort option", async () => {
  const user = userEvent.setup()
  const { setSortBy } = setup()

  const button = screen.getByText("Mock Select")
  await user.click(button)

  expect(setSortBy).toHaveBeenCalledWith("az")
})


it("updates start and end dates", async () => {
  const user = userEvent.setup()
  const { setStartDate, setEndDate } = setup()

  const dateInputs = document.querySelectorAll('input[type="date"]')

  const startInput = dateInputs[0] as HTMLInputElement
  const endInput = dateInputs[1] as HTMLInputElement

  await user.type(startInput, "2024-01-01")
  await user.type(endInput, "2024-01-31")

  expect(setStartDate).toHaveBeenCalled()
  expect(setEndDate).toHaveBeenCalled()
})


  it("calls onClear when Clear button clicked", async () => {
    const user = userEvent.setup()
    const { onClear } = setup()

    const clearButton = screen.getByRole("button", { name: /clear/i })
    await user.click(clearButton)

    expect(onClear).toHaveBeenCalledTimes(1)
  })
})
