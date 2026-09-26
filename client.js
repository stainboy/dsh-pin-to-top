import React from 'react'

export const inject = ['slots', 'workspaces']

export function findWorkspace(items, sessionId) {
  return items.find((workspace) => workspace.sessionIds.includes(sessionId))
}

export function isPinned(workspace, sessionId) {
  return workspace !== undefined && workspace.sessionIds[0] === sessionId
}

export function unpinAnchor(workspace, sessionId) {
  if (workspace === undefined || workspace.sessionIds[0] !== sessionId) return undefined
  return workspace.sessionIds[2]
}

export function PinSessionAction({ sessionId, useWorkspaces, workspaces }) {
  const workspace = useWorkspaces((snapshot) => findWorkspace(snapshot.items, sessionId))
  const pinned = isPinned(workspace, sessionId)
  const [pending, setPending] = React.useState(false)
  const [error, setError] = React.useState('')

  if (workspace === undefined) return null

  const label = pending
    ? 'Updating pin state…'
    : pinned
      ? 'Unpin session'
      : 'Pin session to top'

  const toggle = async () => {
    if (pending) return
    setPending(true)
    setError('')
    try {
      const beforeSessionId = pinned ? unpinAnchor(workspace, sessionId) : workspace.sessionIds[0]
      await workspaces.insertSessionBefore(workspace.workspaceId, sessionId, beforeSessionId)
    } catch (reason) {
      const message = reason instanceof Error ? reason.message : String(reason)
      setError(message)
      console.error('dsh-pin-to-top:', reason)
    } finally {
      setPending(false)
    }
  }

  return React.createElement(
    'span',
    { className: 'dsh-pin-to-top-wrap' },
    React.createElement(
      'button',
      {
        type: 'button',
        className: 'dsh-pin-to-top-button',
        disabled: pending,
        'aria-pressed': pinned,
        'aria-label': label,
        title: error || label,
        onClick: toggle,
      },
      React.createElement(
        'svg',
        {
          viewBox: '0 0 24 24',
          width: 16,
          height: 16,
          'aria-hidden': 'true',
          fill: pinned ? 'currentColor' : 'none',
          stroke: 'currentColor',
          strokeWidth: 1.8,
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
        },
        React.createElement('path', { d: 'M14.5 4.5 19 9l-3 1.5-3.5 3.5.5 4-1 1-3-4-4-3 1-1 4 .5 3.5-3.5 1.5-3Z' }),
        React.createElement('path', { d: 'm8.5 15.5-4 4' }),
      ),
      React.createElement('span', null, pending ? '…' : pinned ? 'Unpin' : 'Pin'),
    ),
  )
}

export function apply(ctx) {
  ctx.effect(() => {
    const style = document.createElement('style')
    style.dataset.plugin = 'dsh-pin-to-top'
    style.textContent = `
      .dsh-pin-to-top-wrap { display: inline-flex; align-items: center; }
      .dsh-pin-to-top-button {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        min-height: 28px;
        padding: 4px 8px;
        border: 1px solid color-mix(in srgb, currentColor 18%, transparent);
        border-radius: 7px;
        color: inherit;
        background: transparent;
        font: inherit;
        font-size: 12px;
        line-height: 1;
        cursor: pointer;
      }
      .dsh-pin-to-top-button:hover:not(:disabled) {
        background: color-mix(in srgb, currentColor 8%, transparent);
      }
      .dsh-pin-to-top-button[aria-pressed="true"] {
        color: #3f7ddd;
        border-color: color-mix(in srgb, #3f7ddd 38%, transparent);
        background: color-mix(in srgb, #3f7ddd 10%, transparent);
      }
      .dsh-pin-to-top-button:focus-visible {
        outline: 2px solid #3f7ddd;
        outline-offset: 2px;
      }
      .dsh-pin-to-top-button:disabled { cursor: wait; opacity: .6; }
    `
    document.head.appendChild(style)
    return () => style.remove()
  }, 'dsh-pin-to-top: styles')

  ctx.slots.inject('conversation.session.header.actions', () => ctx.slots.register(
    {
      name: 'conversation.session.header.actions',
      id: 'pin-to-top',
      order: 10,
      label: 'Pin session',
      workspaces: ctx.workspaces,
    },
    PinSessionAction,
  ))
}
