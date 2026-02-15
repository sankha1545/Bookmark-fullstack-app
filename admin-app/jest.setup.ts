import "@testing-library/jest-dom"

import { jest } from "@jest/globals"

class IntersectionObserverMock {
  observe = jest.fn()
  unobserve = jest.fn()
  disconnect = jest.fn()
}

global.IntersectionObserver = IntersectionObserverMock as any
