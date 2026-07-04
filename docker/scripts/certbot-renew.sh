#!/bin/bash
# Renew Let's Encrypt certs + reload nginx. Run twice daily via cron/systemd:
#   0 */12 * * *  cd /var/www/telcoflo-v1 && bash docker/scripts/certbot-renew.sh >> /var/log/certbot-renew.log 2>&1
set -e
cd "$(cd "$(dirname "$0")/../.." && pwd)"
COMPOSE="docker compose -f docker-compose.production.yaml -f docker-compose.tls.yaml"
$COMPOSE run --rm certbot renew --webroot -w /var/www/certbot --quiet
$COMPOSE exec -T nginx nginx -s reload 2>/dev/null || $COMPOSE restart nginx
