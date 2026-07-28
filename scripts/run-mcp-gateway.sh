#!/bin/sh
set -eu

token_file="$1"
profile="$2"
port="$3"
log_file="$4"
docker_bin="$5"

token="$(cat "$token_file")"
rm -f "$token_file"
export MCP_GATEWAY_AUTH_TOKEN="$token"

exec "$docker_bin" mcp gateway run \
  --profile "$profile" \
  --transport streaming \
  --port "$port" \
  >"$log_file" 2>&1
