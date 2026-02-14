import { render, screen } from "@testing-library/react"
import AdminShell from "@/src/components/layout/AdminShell"

describe("AdminShell", () => {
  it("renders children correctly", () => {
    render(
      <AdminShell>
        <div data-testid="child">Hello Admin</div>
      </AdminShell>
    )

    expect(screen.getByTestId("child")).toBeInTheDocument()
  })
})
