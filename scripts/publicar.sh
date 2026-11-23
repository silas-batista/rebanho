#!/bin/sh
# Sobe o Rebanho em modo produção e o expõe na internet por um túnel gratuito da Cloudflare.
# O endereço público (https://...trycloudflare.com) aparece no terminal e muda a cada execução.
# Ctrl+C encerra o túnel e o sistema.
set -eu
cd "$(dirname "$0")/.."

[ -f .env ] || { echo "Crie o arquivo .env a partir de .env.example antes de publicar."; exit 1; }
command -v cloudflared >/dev/null || { echo "Instale o cloudflared: brew install cloudflared"; exit 1; }

PORT="${PORT:-3000}"
NODE_ENV=production PORT="$PORT" node --env-file=.env src/server.js &
SERVIDOR=$!
trap 'kill $SERVIDOR 2>/dev/null' EXIT INT TERM

sleep 1
cloudflared tunnel --no-autoupdate --url "http://localhost:$PORT"
