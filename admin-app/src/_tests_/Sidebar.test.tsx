import { render, screen } from "@testing-library/react"
import Sidebar from "@/src/components/layout/Sidebar"


jest.mock("next/navigation", () => ({
  usePathname: () => "/dashboard",
}))


jest.mock("next/link", () => {
  return ({ children, ...props }: any) => {
    return <a {...props}>{children}</a>
  }
})

describe("Sidebar", () => {
  it("renders navigation items", () => {
    render(<Sidebar />)

    expect(screen.getByText("Dashboard")).toBeInTheDocument()
    expect(screen.getByText("Users")).toBeInTheDocument()
    expect(screen.getByText("Contacts")).toBeInTheDocument()
  })

  it("applies active styling to current route", () => {
    render(<Sidebar />)

    const dashboardLink = screen.getByRole("link", {
      name: /dashboard/i,
    })

    expect(dashboardLink.className).toMatch(/bg-gradient-to-r/)
  })
})
