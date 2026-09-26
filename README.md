# dsh-pin-to-top

A standard DeepSeek Harness Web/Cordis client plugin that adds a **Pin / Unpin** control to the current Session header.

The plugin uses DSH's public `conversation.session.header.actions` Slot and the public Client `workspaces.insertSessionBefore(...)` Service. It does not patch or replace DSH source code.

## Behavior

- **Pin** moves the current Session to the first position in its Workspace's durable `sessionIds` order.
- **Unpin** moves it below the Session that follows it.
- The button is hidden for Sessions that are not attached to a Workspace.
- DSH's Workspace service persists and broadcasts the resulting order.

> DSH currently exposes workspace ordering but no separate pinned-set model. Consequently, this release supports one effective top-pinned Session per Workspace: whichever Session occupies the first position.

## Install

Add this package as a plugin row in the Host composition that supplies browser client modules:

```yaml
- dsh-pin-to-top
```

If installing from GitHub rather than npm, add the repository to the Harness package environment first, then reference the installed package name in `cordis.yml`.

The package advertises its browser half through `package.json`:

```json
{
  "dsh": {
    "client": {
      "inject": [
        "@deepseek-ai/dsh-api-workspace-controller",
        "@deepseek-ai/dsh-client-ui-conversation"
      ],
      "platform": "web"
    }
  }
}
```

Restart DSH after changing the composition. Client-package changes require rebuilding the Web artifacts unless the DSH client-plugin HMR watcher is running.

## Development

```bash
npm test
```

The implementation is intentionally dependency-light and ships as plain ESM JavaScript.

## License

MIT
