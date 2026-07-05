#!/bin/bash
# Authored 2026-07-05 by Claude Opus 4.8 (1M context).
# Load-characterization orchestrator (Phase 10 performance report).
# Runs a constant-VU hold at each level and captures the FULL resource picture
# during the steady window: per-container CPU/mem (docker stats), system CPU
# breakdown user/sys/iowait/steal + run-queue + swap + disk I/O (vmstat),
# load average, system memory, MySQL threads + queries/sec, php-fpm workers.
# Plus exact k6 latency/throughput JSON per level.
#
# Run DETACHED on the EC2 box (survives SSH drops):
#   setsid bash /tmp/characterize.sh 4vcpu "50 100 150 ... 1500" >/tmp/char_4vcpu.log 2>&1 &
# Output: /tmp/char_<SIZE>.txt  (parsed into docs/performance-report.md)
set +e
SIZE="$1"; shift
LEVELS="$*"
OUT="/tmp/char_${SIZE}.txt"
NCPU=$(nproc)
MEM_TOTAL=$(free -m | awk '/^Mem:/{print $2}')
MYSQL() { docker exec telcoflo-v1-mysql sh -c 'mysql -uroot -p"$MYSQL_ROOT_PASSWORD" -N -e "'"$1"'"' 2>/dev/null; }
: > "$OUT"
{
  echo "CHAR_META size=${SIZE} ncpu=${NCPU} mem_total_mb=${MEM_TOTAL} levels=${LEVELS}"
  echo "CHAR_FPM $(docker exec telcoflo-v1-app grep -E '^pm\.max_children|^pm ' /usr/local/etc/php-fpm.d/www.conf 2>/dev/null | tr '\n' ' ')"
  echo "CHAR_START_UTC $(date -u +%FT%TZ)"
} >> "$OUT"

for N in $LEVELS; do
  echo "===LEVEL vus=${N}===" >> "$OUT"
  KOUT="/tmp/char_${SIZE}_${N}.k6"; : > "$KOUT"
  # 60s constant-VU hold (10s ramp-in + 60s hold + 5s ramp-out), named for stats.
  ( docker run --rm -i --name char-k6 --network telcoflo-v1-net \
      -e BASE_URL=http://nginx -e SCENARIO=hold -e HOLD_VUS=${N} -e HOLD_DURATION=60s \
      -e SERVICE_CODE='*217#' -e INPUTS=1 -e GATEWAY_TIMEOUT=10s -e SLO_MS=4000 \
      grafana/k6 run - < /tmp/ussd-flow.js > "$KOUT" 2>&1 ) &
  KPID=$!

  sleep 14   # let the 10s ramp finish + reach steady state before sampling
  # DB throughput baseline (Questions counter delta over the window -> queries/sec).
  Q0=$(MYSQL "SHOW GLOBAL STATUS LIKE 'Questions'" | awk '{print $2}'); T0=$(date +%s)

  for s in $(seq 1 10); do
    docker stats --no-stream --format '{{.Name}}|{{.CPUPerc}}|{{.MemPerc}}|{{.MemUsage}}' \
      char-k6 telcoflo-v1-app telcoflo-v1-mysql telcoflo-v1-nginx telcoflo-v1-redis 2>/dev/null \
      | sed 's/^/STAT '"${N}"' /' >> "$OUT"
    echo "LOAD ${N} $(cat /proc/loadavg)" >> "$OUT"
    if [ $((s % 3)) -eq 0 ]; then
      tc=$(MYSQL "SHOW STATUS LIKE 'Threads_connected'" | awk '{print $2}')
      tr=$(MYSQL "SHOW STATUS LIKE 'Threads_running'"   | awk '{print $2}')
      echo "MYSQL ${N} connected=${tc:-.} running=${tr:-.}" >> "$OUT"
      fpm=$(docker run --rm --network telcoflo-v1-net curlimages/curl -s --max-time 3 http://telcoflo-v1-fpm-exporter:9253/metrics 2>/dev/null | awk '/^phpfpm_(active_processes|idle_processes|listen_queue) /{printf "%s=%d ",$1,$2}')
      echo "FPM ${N} ${fpm}" >> "$OUT"
      # vmstat: 1s interval sample -> CPU us/sy/id/wa/st, run-queue r/b, swap, disk bi/bo.
      vmstat 1 2 | tail -1 | awk -v n="${N}" '{printf "VMSTAT %s r=%s b=%s swpd=%s free=%s cache=%s si=%s so=%s bi=%s bo=%s cs=%s us=%s sy=%s id=%s wa=%s st=%s\n", n,$1,$2,$3,$4,$6,$7,$8,$9,$10,$12,$13,$14,$15,$16,$17}' >> "$OUT"
      free -m | awk -v n="${N}" '/^Mem:/{printf "FREEMEM %s used_mb=%s free_mb=%s available_mb=%s\n", n,$3,$4,$7}' >> "$OUT"
    fi
    sleep 3
  done

  Q1=$(MYSQL "SHOW GLOBAL STATUS LIKE 'Questions'" | awk '{print $2}'); T1=$(date +%s)
  if [ -n "$Q0" ] && [ -n "$Q1" ] && [ "$T1" -gt "$T0" ]; then
    echo "QPS ${N} questions_delta=$((Q1-Q0)) seconds=$((T1-T0)) qps=$(( (Q1-Q0)/(T1-T0) ))" >> "$OUT"
  fi

  wait $KPID
  echo -n "K6JSON ${N} " >> "$OUT"
  grep -o '@@K6JSON@@.*@@END@@' "$KOUT" | sed 's/@@K6JSON@@//; s/@@END@@//' >> "$OUT"
  echo "" >> "$OUT"
  echo "===ENDLEVEL vus=${N}===" >> "$OUT"
  sleep 10   # cooldown so the next level starts from a settled baseline
done
echo "CHAR_END_UTC $(date -u +%FT%TZ)" >> "$OUT"
echo "___CHAR_DONE___" >> "$OUT"
