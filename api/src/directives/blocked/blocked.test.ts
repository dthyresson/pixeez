import { mockRedwoodDirective, getDirectiveName } from '@redwoodjs/testing/api'
import { AuthenticationError } from '@redwoodjs/graphql-server'

import blocked from './blocked'

describe('blocked directive', () => {
  it('declares the directive sdl as schema, with the correct name', () => {
    expect(blocked.schema).toBeTruthy()
    expect(getDirectiveName(blocked.schema)).toBe('blocked')
  })

  it('blocked throws an AuthenticationError', () => {
    const mockExecution = mockRedwoodDirective(blocked, { context: {} })

    expect(mockExecution).toThrow(AuthenticationError)
    expect(mockExecution).toThrow(
      'You are not authorized to access this resource'
    )
  })
})

// This test file was generated for the blocked directive.
// You may want to add more specific tests as needed.
