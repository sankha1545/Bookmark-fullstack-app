import "@testing-library/jest-dom"

process.env.__NEXT_PRIVATE_PREBUNDLED_REACT = "next"

// Kill Next runtime patches
jest.mock("next/dist/server/node-environment-extensions/unhandled-rejection", () => ({}))
jest.mock("next/dist/server/node-environment-extensions/fast-set-immediate.external", () => ({}))

// Mock framer-motion
jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children }: any) => children,
  },
  AnimatePresence: ({ children }: any) => children,
}))

// Safe BroadcastChannel mock
class MockBroadcastChannel {
  name: string
  onmessage: ((event: any) => void) | null = null

  constructor(name: string) {
    this.name = name
  }

  postMessage() {}
  close() {}
}

Object.defineProperty(global, "BroadcastChannel", {
  writable: true,
  value: MockBroadcastChannel,
})
