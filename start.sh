#!/bin/sh
set -eu

profile="${MCP_PROFILE:-ecom_2_0}"
port="${MCP_GATEWAY_PORT:-8811}"
mkdir -p data
gateway_pid_file="data/mcp-gateway.pid"

if ! docker mcp profile show "$profile" >/dev/null 2>&1; then
  echo "Профиль Docker MCP '$profile' не найден." >&2
  exit 1
fi

if command -v openssl >/dev/null 2>&1; then
  MCP_GATEWAY_AUTH_TOKEN="$(openssl rand -hex 24)"
else
  MCP_GATEWAY_AUTH_TOKEN="$(date +%s)-$$-jira-do-mcp"
fi
export MCP_GATEWAY_AUTH_TOKEN

if [ -f "$gateway_pid_file" ]; then
  previous_pid="$(cat "$gateway_pid_file" 2>/dev/null || true)"
  if [ -n "$previous_pid" ] && kill -0 "$previous_pid" 2>/dev/null; then
    kill "$previous_pid" >/dev/null 2>&1 || true
    for _ in $(seq 1 20); do
      kill -0 "$previous_pid" 2>/dev/null || break
      sleep 0.1
    done
  fi
fi

nohup docker mcp gateway run \
  --profile "$profile" \
  --transport streaming \
  --port "$port" \
  >data/mcp-gateway.log 2>&1 </dev/null &
gateway_pid=$!
echo "$gateway_pid" >"$gateway_pid_file"

ready=0
for _ in $(seq 1 30); do
  if grep -q 'Start streaming server' data/mcp-gateway.log 2>/dev/null; then ready=1; break; fi
  if ! kill -0 "$gateway_pid" 2>/dev/null; then
    echo "Docker MCP Gateway завершился. Последние строки:" >&2
    tail -30 data/mcp-gateway.log >&2
    rm -f "$gateway_pid_file"
    exit 1
  fi
  sleep 1
done

if [ "$ready" -ne 1 ]; then
  echo "Docker MCP Gateway не запустился за 30 секунд." >&2
  exit 1
fi

docker compose up --build -d
echo "Jira document sync запущен: http://localhost:8080"
echo "Docker MCP Gateway PID: $gateway_pid"

if [ "${MCP_GATEWAY_FOREGROUND:-0}" = "1" ]; then
  cleanup() {
    kill "$gateway_pid" >/dev/null 2>&1 || true
  }
  trap cleanup EXIT INT TERM
  echo "Gateway работает в режиме супервизора. Для остановки нажмите Ctrl+C."
  wait "$gateway_pid"
fi
