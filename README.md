# dsh-pin-to-top

> [!IMPORTANT]
> **This repository is archived and no longer maintained.**
>
> DeepSeek Harness **v0.1.7-rc.2** includes built-in Session pinning, making this plugin unnecessary. Use DSH's native **Pin session / Unpin session** actions instead.

## Historical purpose

This repository provided an experimental DeepSeek Harness Web/Cordis client plugin for moving a Session to the top of its Workspace. It used DSH's public Client extension points and was created before native Session pinning was available.

The built-in implementation in DSH v0.1.7-rc.2 provides a dedicated durable `pinnedSessionIds` model and native pin/unpin actions in the Workspace UI. It supersedes this plugin's earlier ordering-based approximation.

## Migration

1. Remove `dsh-pin-to-top` from your DSH profile dependencies.
2. Remove its plugin row from your Cordis composition or patch.
3. Restart DSH.
4. Use the built-in **Pin session** action from the Session row menu or hover controls.

No replacement plugin is required.

## License

MIT
