# Jira Document Sync

> **AI disclosure:** this project was created with the assistance of **OpenAI Codex (GPT-5)**. All generated code and documentation remain subject to human review.

A Dockerized service that periodically reads Jira issues through Docker MCP Gateway, groups them using a configurable hierarchy, generates a Markdown document, and presents it in a web interface. Local task comments are stored independently from Jira and the generated document.

The primary documentation is [README.en.md](README.en.md). Russian documentation is available in [README.ru.md](README.ru.md).

- [English documentation](README.en.md)
- [Русская документация](README.ru.md)
- [English changelog](CHANGELOG.en.md)
- [Журнал изменений на русском](CHANGELOG.ru.md)
- [Security policy](SECURITY.md)

## Quick start

```bash
cp grouping.config.example.json grouping.config.json
# Edit grouping.config.json and configure the Docker MCP profile in start.sh/MCP_PROFILE.
chmod +x start.sh
./start.sh
```

Open <http://localhost:8080>.

## License

[MIT](LICENSE)

