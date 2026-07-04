#!/bin/bash
# One-time Let's Encrypt setup for Telcoflo V1 (promotion step). Run from the app
# directory on the EC2 after DNS points APP_DOMAIN at the box and 443 is open.
# Uses the dummy-cert bootstrap so nginx can start before real certs exist.
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
APP_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"
cd "$APP_DIR"
[ -f .env ] && set -a && . ./.env && set +a

DOMAIN="${APP_DOMAIN:?set APP_DOMAIN in .env}"
EMAIL="${ACME_EMAIL:?set ACME_EMAIL in .env}"
COMPOSE="docker compose -f docker-compose.production.yaml -f docker-compose.tls.yaml"
LIVE="/etc/letsencrypt/live/$DOMAIN"

echo "=== Domain: $DOMAIN ==="

# 1) Dummy cert so nginx (TLS config) can boot.
$COMPOSE run --rm --entrypoint "sh -c" certbot "\
  mkdir -p '$LIVE' && \
  openssl req -x509 -nodes -newkey rsa:2048 -days 1 \
    -keyout '$LIVE/privkey.pem' -out '$LIVE/fullchain.pem' -subj '/CN=$DOMAIN'"

# 2) Bring the stack up with TLS nginx.
$COMPOSE up -d nginx app mysql redis

sleep 5

# 3) Replace the dummy with a real cert (webroot challenge).
$COMPOSE run --rm --entrypoint "sh -c" certbot "\
  rm -rf '/etc/letsencrypt/live/$DOMAIN' '/etc/letsencrypt/archive/$DOMAIN' '/etc/letsencrypt/renewal/$DOMAIN.conf'; \
  certbot certonly --webroot -w /var/www/certbot \
    -d '$DOMAIN' --email '$EMAIL' --agree-tos --non-interactive --rsa-key-size 4096"

# 4) Reload nginx to pick up the real cert.
$COMPOSE exec -T nginx nginx -s reload 2>/dev/null || $COMPOSE restart nginx

echo "=== HTTPS active for https://$DOMAIN ==="
echo "Renewal: add a cron/systemd-timer running docker/scripts/certbot-renew.sh (twice daily)."
