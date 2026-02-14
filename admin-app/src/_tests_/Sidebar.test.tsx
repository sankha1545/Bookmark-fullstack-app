import { render, screen } from "@testing-library/react"
import Sidebar from "@/src/components/layout/Sidebar"

// 🔥 Mock next/navigation (App Router)
jest.mock("next/navigation", () => ({
  usePathname: () => "/dashboard",
}))

// 🔥 Mock next/link
jest.mock("next/link", () => {
  return ({ children, href }: any) => {
    return <a href={href}>{children}</a>
  }
})

describe("Sidebar", () => {
  it("renders navigation items", () => {
    render(<Sidebar />)

    expect(screen.getByText("Dashboard")).toBeInTheDocument()
    expect(screen.getByText("Users")).toBeInTheDocument()
    expect(screen.getByText("Contacts")).toBeInTheDocument()
  })

  it("highlights active route", () => {
    render(<Sidebar />)

    const dashboardLink = screen.getByText("Dashboard")
    expect(dashboardLink).toHaveAttribute("aria-current", "page")
  })
})
