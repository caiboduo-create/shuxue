#!/usr/bin/env bash
set -euo pipefail

APP_NAME="math-ai"
APP_DIR="/var/www/${APP_NAME}"
REPO_URL="https://github.com/caiboduo-create/shuxue.git"
REPO_BRANCH="refactor/math-ai-v2"
DOMAIN="zhangbairs.com"
API_PORT="3001"

export DEBIAN_FRONTEND=noninteractive

echo "==> Installing system packages"
apt-get update
apt-get install -y ca-certificates curl git nginx

if ! command -v node >/dev/null 2>&1 || ! node -e "process.exit(Number(process.versions.node.split('.')[0]) >= 20 ? 0 : 1)" >/dev/null 2>&1; then
  echo "==> Installing Node.js 22"
  curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
  apt-get install -y nodejs
fi

echo "==> Installing PM2"
npm install -g pm2

echo "==> Fetching app code"
mkdir -p "$(dirname "$APP_DIR")"
if [ -d "$APP_DIR/.git" ]; then
  git -C "$APP_DIR" fetch origin "$REPO_BRANCH"
  git -C "$APP_DIR" checkout "$REPO_BRANCH"
  git -C "$APP_DIR" reset --hard "origin/$REPO_BRANCH"
else
  rm -rf "$APP_DIR"
  git clone --branch "$REPO_BRANCH" "$REPO_URL" "$APP_DIR"
fi

echo "==> Installing app dependencies"
cd "$APP_DIR/server"
npm ci

cd "$APP_DIR/web"
npm ci
npm run build

echo "==> Writing environment file"
cat >/etc/math-ai.env <<ENV
PORT=${API_PORT}
LLM_PROVIDER=mock
# OPENAI_API_KEY=
# OPENAI_MODEL=gpt-4o-mini
ENV
chmod 600 /etc/math-ai.env

echo "==> Starting API with PM2"
cd "$APP_DIR/server"
pm2 delete math-ai-api >/dev/null 2>&1 || true
set -a
. /etc/math-ai.env
set +a
pm2 start src/index.js --name math-ai-api --time
pm2 save
pm2 startup systemd -u root --hp /root >/tmp/math-ai-pm2-startup.txt || true
bash /tmp/math-ai-pm2-startup.txt >/dev/null 2>&1 || true

echo "==> Configuring Nginx"
cat >/etc/nginx/sites-available/math-ai <<NGINX
server {
    listen 80;
    listen [::]:80;
    server_name ${DOMAIN} www.${DOMAIN} 152.42.244.143 _;

    root ${APP_DIR}/web/dist;
    index index.html;

    client_max_body_size 15m;

    location /api/ {
        proxy_pass http://127.0.0.1:${API_PORT}/api/;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    location / {
        try_files \$uri \$uri/ /index.html;
    }
}
NGINX

ln -sfn /etc/nginx/sites-available/math-ai /etc/nginx/sites-enabled/math-ai
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl enable nginx
systemctl restart nginx

echo "==> Local health checks"
curl -fsS "http://127.0.0.1:${API_PORT}/api/meta" >/tmp/math-ai-api-meta.json
curl -fsSI "http://127.0.0.1/" | head -n 1

echo
echo "DONE"
echo "Open: http://152.42.244.143"
echo "After DNS points to this server, open: http://${DOMAIN}"
