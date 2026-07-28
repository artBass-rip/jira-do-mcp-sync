# TeamWork

> **AI disclosure:** this project was created with the assistance of **OpenAI Codex (GPT-5)**. The maintainer reviewed and accepted the resulting implementation and documentation.

TeamWork periodically retrieves Jira issues through an authenticated Docker MCP Gateway, groups them into a navigable hierarchy, generates Markdown, and serves an editor-style web viewer.

## Features

- Docker MCP Gateway integration; Jira credentials and OAuth tokens are not stored in project configuration.
- Configurable grouping: Goal → theme → active sprint → future sprint → backlog.
- Periodic and manual synchronization.
- Markdown viewer with document outline, search, scroll tracking, and nested folding.
- Configurable issue-type icons and task status in headings.
- Local task comments displayed below task headings and managed from a side panel.
- Independent comment storage with automatic cleanup when an issue disappears.
- Structured JSONL application logs and an in-app log viewer.
- Containerized runtime with no third-party Node.js runtime dependencies.

## Requirements

- macOS or another Docker Desktop environment with Docker MCP Toolkit enabled.
- Docker Desktop 4.62 or newer is recommended.
- A Docker MCP profile containing an authenticated Atlassian server.
- Node.js 22+ only for local validation outside Docker.

## Configuration

Create the private runtime configuration:

```bash
cp grouping.config.example.json grouping.config.json
```

Set the Atlassian cloud ID, project key, JQL, sprint field, grouping patterns, output path, and synchronization interval. `grouping.config.json` is ignored by Git because it may contain organization-specific identifiers.

The Docker MCP profile defaults to `ecom_2_0`. Override it without editing the project:

```bash
MCP_PROFILE=my_profile ./start.sh
```

The launcher creates an ephemeral Gateway bearer token and passes it only through process/container environment variables. On macOS, `launchd` owns the long-running Gateway so closing the terminal does not stop synchronization. A mode-`0600` handoff file is deleted immediately after the Gateway reads it. Atlassian OAuth remains managed by Docker Desktop.

On non-macOS systems, supervisor-style execution is available:

```bash
MCP_GATEWAY_FOREGROUND=1 ./start.sh
```

Open <http://localhost:8080> after startup.

### Network access and authentication

By default Compose binds the application only to `127.0.0.1`. To expose it on a trusted network, enable Basic Auth and explicitly change the bind address:

```bash
APP_BIND_ADDRESS=0.0.0.0 \
APP_AUTH_USER=owner \
APP_AUTH_PASSWORD='use-a-long-random-password' \
./start.sh
```

Do not expose the service publicly without HTTPS in front of it. The password is passed at runtime and must never be committed.

## Runtime data

Generated documents, local comments, logs, and process files live under `data/`. They are intentionally excluded from version control. Local comments are never sent to Jira and never embedded into the generated Markdown.

## Development

```bash
npm ci
npm run check
docker compose build
```

## Security

GitHub Actions run syntax and behavioral tests, `npm audit`, CodeQL analysis, dependency review, and Dependabot updates. The container runs as an unprivileged user with a read-only root filesystem, dropped capabilities, `no-new-privileges`, and a healthcheck. Document paths are restricted to `data/`. Secret scanning, push protection, private vulnerability reporting, and automated security updates are enabled for the public repository. See [SECURITY.md](SECURITY.md).

## Documentation

- [Русская документация](README.ru.md)
- [English changelog](CHANGELOG.en.md)
- [Журнал изменений на русском](CHANGELOG.ru.md)

## License

MIT © 2026 artBass-rip
