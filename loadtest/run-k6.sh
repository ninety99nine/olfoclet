#!/bin/sh
# Run the USSD load test against the Telcoflo V1 stack via the grafana/k6 image.
#
#   ./loadtest/run-k6.sh                       # ramp profile vs the local stack
#   SCENARIO=smoke ./loadtest/run-k6.sh        # quick smoke
#   SCENARIO=spike ./loadtest/run-k6.sh        # SMS-campaign burst
#   BASE_URL=http://<aws-host>:8080 ./loadtest/run-k6.sh
#
# To push metrics to Grafana Cloud, export the K6_PROMETHEUS_RW_* vars (see
# loadtest/k6/README.md) and pass OUTPUT=grafana-cloud.
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
SCENARIO="${SCENARIO:-ramp}"
# Inside the k6 container we reach the app via the compose network's nginx service.
BASE_URL="${BASE_URL:-http://nginx}"
NETWORK="${NETWORK:-telcoflo-v1-net}"

OUT=""
if [ "${OUTPUT}" = "grafana-cloud" ]; then
    OUT="-o experimental-prometheus-rw"
fi

echo "[run-k6] scenario=${SCENARIO} base_url=${BASE_URL} network=${NETWORK}"

exec docker run --rm -i \
    --network "${NETWORK}" \
    -e BASE_URL="${BASE_URL}" \
    -e SERVICE_CODE="${SERVICE_CODE:-*217#}" \
    -e MSISDN_PREFIX="${MSISDN_PREFIX:-2677}" \
    -e INPUTS="${INPUTS:-1}" \
    -e SCENARIO="${SCENARIO}" \
    -e K6_PROMETHEUS_RW_SERVER_URL="${K6_PROMETHEUS_RW_SERVER_URL}" \
    -e K6_PROMETHEUS_RW_USERNAME="${K6_PROMETHEUS_RW_USERNAME}" \
    -e K6_PROMETHEUS_RW_PASSWORD="${K6_PROMETHEUS_RW_PASSWORD}" \
    -e K6_PROMETHEUS_RW_TREND_STATS="p(95),p(99),avg,max" \
    -v "${SCRIPT_DIR}/k6:/scripts:ro" \
    grafana/k6 run ${OUT} /scripts/ussd-flow.js
