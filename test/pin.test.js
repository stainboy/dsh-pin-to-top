import test from 'node:test'
import assert from 'node:assert/strict'

import { findWorkspace, isPinned, unpinAnchor } from '../client.js'

const workspace = {
  workspaceId: 'playbox',
  sessionIds: ['a', 'b', 'c', 'd'],
}

test('findWorkspace resolves the owning workspace', () => {
  assert.equal(findWorkspace([workspace], 'c'), workspace)
  assert.equal(findWorkspace([workspace], 'missing'), undefined)
})

test('only the first session is pinned', () => {
  assert.equal(isPinned(workspace, 'a'), true)
  assert.equal(isPinned(workspace, 'b'), false)
  assert.equal(isPinned(undefined, 'a'), false)
})

test('unpin moves the first session below the next session', () => {
  assert.equal(unpinAnchor(workspace, 'a'), 'c')
  assert.equal(unpinAnchor(workspace, 'b'), undefined)
})

test('unpin appends when the workspace has two or fewer sessions', () => {
  assert.equal(unpinAnchor({ workspaceId: 'x', sessionIds: ['a', 'b'] }, 'a'), undefined)
  assert.equal(unpinAnchor({ workspaceId: 'x', sessionIds: ['a'] }, 'a'), undefined)
})
