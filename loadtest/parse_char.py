#!/usr/bin/env python3
# Authored 2026-07-05 by Claude Opus 4.8 (1M context).
"""Parse a characterization file (loadtest/results/char_<size>.txt) into a
per-level table fusing k6 latency/throughput JSON with aggregated resource
samples (CPU per container + system CPU breakdown, load, memory, DB, disk).
Usage: python3 parse_char.py loadtest/results/char_2vcpu.txt
Outputs a JSON list (one object per VU level) to stdout."""
import sys, json, re
from statistics import mean

def pct(s):  # "54.19%" -> 54.19
    try: return float(str(s).replace('%',''))
    except: return None

def main(path):
    meta = {}
    levels = {}  # vus -> dict of raw sample lists
    with open(path) as f:
        for line in f:
            line = line.rstrip('\n')
            if line.startswith('CHAR_META'):
                for kv in line.split()[1:]:
                    if '=' in kv:
                        k,v = kv.split('=',1); meta[k]=v
            elif line.startswith('CHAR_FPM'):
                meta['fpm'] = line[len('CHAR_FPM '):].strip()
            elif line.startswith('STAT '):
                p = line.split(' ',2)  # STAT <vus> <name|cpu|memp|memusage>
                vus = int(p[1]); rec = p[2].split('|')
                L = levels.setdefault(vus, {})
                name, cpu, memp = rec[0], pct(rec[1]), pct(rec[2])
                L.setdefault('cpu_'+name, []).append(cpu if cpu is not None else 0)
                if name == 'telcoflo-v1-app': L.setdefault('app_memp', []).append(memp)
                if name == 'telcoflo-v1-mysql': L.setdefault('mysql_memp', []).append(memp)
            elif line.startswith('LOAD '):
                p = line.split(); vus=int(p[1])
                levels.setdefault(vus, {}).setdefault('load1', []).append(float(p[2]))
            elif line.startswith('VMSTAT '):
                p = line.split(); vus=int(p[1]); L=levels.setdefault(vus, {})
                for kv in p[2:]:
                    k,v = kv.split('=')
                    if k in ('us','sy','id','wa','st','r','b','bi','bo','cs'):
                        L.setdefault('vm_'+k, []).append(float(v))
            elif line.startswith('MYSQL '):
                p = line.split(); vus=int(p[1]); L=levels.setdefault(vus, {})
                for kv in p[2:]:
                    k,v = kv.split('=')
                    if v.isdigit(): L.setdefault('my_'+k, []).append(int(v))
            elif line.startswith('FREEMEM '):
                p = line.split(); vus=int(p[1]); L=levels.setdefault(vus, {})
                for kv in p[2:]:
                    k,v=kv.split('=')
                    if v.isdigit(): L.setdefault('mem_'+k, []).append(int(v))
            elif line.startswith('QPS '):
                p = line.split(); vus=int(p[1])
                for kv in p[2:]:
                    k,v=kv.split('=')
                    if k=='qps' and v.lstrip('-').isdigit():
                        levels.setdefault(vus, {})['qps']=int(v)
            elif line.startswith('K6JSON '):
                p = line.split(' ',2); vus=int(p[1])
                try: levels.setdefault(vus, {})['k6']=json.loads(p[2])
                except: pass

    ncpu = int(meta.get('ncpu', 0))
    def avg(x): return round(mean(x),1) if x else None
    def peak(x): return round(max(x),1) if x else None
    rows = []
    for vus in sorted(levels):
        L = levels[vus]; k6 = L.get('k6', {})
        app = L.get('cpu_telcoflo-v1-app', [])
        total_cpu = None
        # sum of all container CPUs excluding k6 (the app-stack load)
        stack = []
        for key in L:
            if key.startswith('cpu_') and key != 'cpu_char-k6':
                pass
        row = {
            'vus': vus,
            'req_s': k6.get('http_reqs_per_s'),
            'dials_s': k6.get('sessions_per_s'),
            'qps': L.get('qps'),
            'start_p50': k6.get('start_ms',{}).get('p50'),
            'start_p95': k6.get('start_ms',{}).get('p95'),
            'start_p99': k6.get('start_ms',{}).get('p99'),
            'start_max': k6.get('start_ms',{}).get('max'),
            'step_p95': k6.get('step_ms',{}).get('p95'),
            'within_slo': k6.get('within_slo_rate'),
            'timeouts': k6.get('dials_timed_out'),
            'http_failed': k6.get('http_failed_rate'),
            'app_cpu_avg': avg(app), 'app_cpu_peak': peak(app),
            'mysql_cpu_avg': avg(L.get('cpu_telcoflo-v1-mysql', [])),
            'nginx_cpu_avg': avg(L.get('cpu_telcoflo-v1-nginx', [])),
            'redis_cpu_avg': avg(L.get('cpu_telcoflo-v1-redis', [])),
            'k6_cpu_avg': avg(L.get('cpu_char-k6', [])),
            'cpu_us_avg': avg(L.get('vm_us', [])),
            'cpu_sy_avg': avg(L.get('vm_sy', [])),
            'cpu_id_avg': avg(L.get('vm_id', [])),
            'cpu_wa_avg': avg(L.get('vm_wa', [])),
            'cpu_st_avg': avg(L.get('vm_st', [])),
            'runq_avg': avg(L.get('vm_r', [])), 'runq_peak': peak(L.get('vm_r', [])),
            'load1_avg': avg(L.get('load1', [])), 'load1_peak': peak(L.get('load1', [])),
            'mysql_conn_peak': peak(L.get('my_connected', [])),
            'mysql_run_peak': peak(L.get('my_running', [])),
            'mem_used_mb': avg(L.get('mem_used_mb', [])),
            'mem_avail_mb': avg(L.get('mem_available_mb', [])),
            'disk_bo_avg': avg(L.get('vm_bo', [])),
        }
        # CPU utilisation of the whole box: 100*ncpu = full. Use (100-idle).
        if row['cpu_id_avg'] is not None:
            row['box_cpu_util_pct'] = round(100 - row['cpu_id_avg'], 1)
        rows.append(row)
    print(json.dumps({'meta': meta, 'ncpu': ncpu, 'levels': rows}, indent=None))

if __name__ == '__main__':
    main(sys.argv[1])
