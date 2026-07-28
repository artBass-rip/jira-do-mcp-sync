# Security Policy

## Supported versions

Security fixes are provided for the latest release on the `master` branch.

## Reporting a vulnerability

Do not open a public issue for a suspected vulnerability. Use GitHub **Private vulnerability reporting** on the repository Security tab. Include reproduction steps, affected versions, impact, and any suggested mitigation.

The maintainer aims to acknowledge reports within seven days. Disclosure timing is coordinated after validation and remediation.

## Secrets and local data

Never commit `grouping.config.json`, `.env` files, generated Jira documents, local comments, logs, runtime tokens, or credentials. Docker Desktop manages Atlassian OAuth; the launcher passes the local Gateway token only through runtime environment variables.

The web service binds to localhost by default. Network deployments must set `APP_AUTH_PASSWORD`, use a strong unique value, and terminate HTTPS in a trusted reverse proxy. Generated-document paths are confined to the runtime `data/` directory.
