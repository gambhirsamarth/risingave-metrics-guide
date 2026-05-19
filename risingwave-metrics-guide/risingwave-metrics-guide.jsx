import { useState } from "react";

const SECTIONS = [
  {
    id: "overview",
    title: "Diagnostic Flowchart",
    icon: "🔍",
    subtitle: "Where to start when something feels wrong",
  },
  {
    id: "barrier",
    title: "Barrier Monitoring",
    icon: "⏱",
    subtitle: "The #1 metric to check first",
  },
  {
    id: "cpu",
    title: "CPU Usage",
    icon: "⚡",
    subtitle: "Streaming & Compactor nodes",
  },
  {
    id: "memory",
    title: "Memory & Eviction",
    icon: "🧠",
    subtitle: "Usable memory, eviction thresholds",
  },
  {
    id: "cache",
    title: "Cache Performance",
    icon: "💾",
    subtitle: "Executor, block, and meta caches",
  },
  {
    id: "compaction",
    title: "Compaction",
    icon: "🗜",
    subtitle: "LSM pending bytes, write stalls",
  },
  {
    id: "backpressure",
    title: "Backpressure",
    icon: "🚦",
    subtitle: "Actor blocking, fragment bottlenecks",
  },
  {
    id: "storage",
    title: "State Access & Storage",
    icon: "📦",
    subtitle: "Read/write bottlenecks, object store",
  },
  {
    id: "source",
    title: "Source Throughput",
    icon: "📡",
    subtitle: "Ingestion rates & upstream limits",
  },
  {
    id: "scaling",
    title: "Scaling Playbook",
    icon: "📐",
    subtitle: "When & how to scale up vs out",
  },
  {
    id: "resources",
    title: "Resources & Links",
    icon: "📚",
    subtitle: "Official docs, tools, community",
  },
];

const HEALTH_ZONES = {
  healthy: { bg: "#0a2e1a", border: "#1a7a3a", text: "#4ade80", label: "HEALTHY" },
  warning: { bg: "#2e2a0a", border: "#7a6a1a", text: "#facc15", label: "WARNING" },
  critical: { bg: "#2e0a0a", border: "#7a1a1a", text: "#f87171", label: "CRITICAL" },
};

function HealthBadge({ zone }) {
  const z = HEALTH_ZONES[zone];
  return (
    <span
      style={{
        display: "inline-block",
        padding: "2px 10px",
        borderRadius: "4px",
        fontSize: "11px",
        fontWeight: 700,
        letterSpacing: "0.08em",
        background: z.bg,
        border: `1px solid ${z.border}`,
        color: z.text,
      }}
    >
      {z.label}
    </span>
  );
}

function MetricCard({ title, grafanaPath, healthy, warning, critical, notes }) {
  return (
    <div
      style={{
        background: "#111318",
        border: "1px solid #23272f",
        borderRadius: "8px",
        padding: "16px 18px",
        marginBottom: "14px",
      }}
    >
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "14px", fontWeight: 700, color: "#e2e8f0", marginBottom: "6px" }}>
        {title}
      </div>
      <div style={{ fontSize: "11px", color: "#64748b", marginBottom: "12px", fontFamily: "monospace" }}>
        📊 {grafanaPath}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
          <HealthBadge zone="healthy" />
          <span style={{ fontSize: "13px", color: "#94a3b8", lineHeight: 1.5 }}>{healthy}</span>
        </div>
        <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
          <HealthBadge zone="warning" />
          <span style={{ fontSize: "13px", color: "#94a3b8", lineHeight: 1.5 }}>{warning}</span>
        </div>
        <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
          <HealthBadge zone="critical" />
          <span style={{ fontSize: "13px", color: "#94a3b8", lineHeight: 1.5 }}>{critical}</span>
        </div>
      </div>
      {notes && (
        <div
          style={{
            marginTop: "12px",
            padding: "10px 12px",
            background: "#0c0e14",
            borderRadius: "6px",
            borderLeft: "3px solid #3b82f6",
            fontSize: "12px",
            color: "#7dd3fc",
            lineHeight: 1.6,
          }}
        >
          💡 {notes}
        </div>
      )}
    </div>
  );
}

function SectionContent({ id }) {
  const prose = { fontSize: "13.5px", color: "#b0bec5", lineHeight: 1.75, marginBottom: "16px" };
  const heading = { fontSize: "16px", fontWeight: 700, color: "#e2e8f0", margin: "20px 0 10px", fontFamily: "'JetBrains Mono', monospace" };
  const subhead = { fontSize: "14px", fontWeight: 600, color: "#cbd5e1", margin: "16px 0 8px" };

  switch (id) {
    case "overview":
      return (
        <div>
          <p style={prose}>
            When you open Grafana and suspect something is off, follow this decision tree. RisingWave's own engineering team recommends checking <strong style={{ color: "#e2e8f0" }}>barrier latency first</strong>, then drilling into the specific bottleneck area.
          </p>
          <div style={{ background: "#0c0e14", borderRadius: "8px", padding: "20px", fontFamily: "monospace", fontSize: "13px", color: "#94a3b8", lineHeight: 2.2, border: "1px solid #1e293b" }}>
            <div style={{ color: "#60a5fa", fontWeight: 700 }}>STEP 1 → Check Barrier Latency & Barrier Number</div>
            <div style={{ paddingLeft: "20px" }}>
              ├─ Climbing endlessly + barrier count growing → <span style={{ color: "#f87171" }}>SERIOUS CONGESTION</span> → go to Steps 2-5{"\n"}
              └─ Fluctuating but stabilizing → <span style={{ color: "#4ade80" }}>NORMAL</span> (dynamic backpressure)
            </div>
            <br />
            <div style={{ color: "#60a5fa", fontWeight: 700 }}>STEP 2 → Check Backpressure (Actor Output Blocking Time)</div>
            <div style={{ paddingLeft: "20px" }}>
              ├─ High backpressure on specific fragments → Find the <em>frontmost</em> bottleneck fragment{"\n"}
              └─ No backpressure → Check source throughput (upstream may be slow)
            </div>
            <br />
            <div style={{ color: "#60a5fa", fontWeight: 700 }}>STEP 3 → Check CPU Utilization</div>
            <div style={{ paddingLeft: "20px" }}>
              ├─ Streaming node CPU near 100% → Scale up compute{"\n"}
              └─ Compactor CPU saturated → Scale up/out compactors
            </div>
            <br />
            <div style={{ color: "#60a5fa", fontWeight: 700 }}>STEP 4 → Check Memory & Cache Misses</div>
            <div style={{ paddingLeft: "20px" }}>
              ├─ Memory {">"} 90% usable + high cache miss → Add memory{"\n"}
              └─ Memory low + low cache miss → Memory is fine, look elsewhere
            </div>
            <br />
            <div style={{ color: "#60a5fa", fontWeight: 700 }}>STEP 5 → Check Compaction & Object Store</div>
            <div style={{ paddingLeft: "20px" }}>
              ├─ LSM pending bytes growing for {">"} 10min → Add compactor CPUs{"\n"}
              ├─ Write stall detected → Urgent: scale compactors immediately{"\n"}
              └─ Object store latency/failure rate high → Network or S3 issue
            </div>
            <br />
            <div style={{ color: "#60a5fa", fontWeight: 700 }}>STEP 6 → Check Await Tree Dump</div>
            <div style={{ paddingLeft: "20px" }}>
              └─ Visit http://meta-node:5691 → shows exactly which operation the barrier is stuck on
            </div>
          </div>
        </div>
      );

    case "barrier":
      return (
        <div>
          <p style={prose}>
            Barriers are special synchronization messages injected every second into the data stream. They flow through the entire streaming graph and serve multiple purposes: triggering delta computation, flushing state to storage, and completing checkpoints. Barrier latency is the single most important health indicator — it's the first thing RisingWave engineers check.
          </p>
          <MetricCard
            title="Barrier Latency"
            grafanaPath="Grafana (dev) → Streaming → Barrier Latency"
            healthy="Stable around 1-3 seconds. Ideal is ~1s (barrier interval)."
            warning="Fluctuating between 3-10 seconds but stabilizing — this is backpressure adjusting."
            critical="Climbing endlessly and never stabilizing. Combined with rising barrier count = serious congestion."
            notes="Two phenomena to distinguish: (1) climbing + never stabilizing = you need more resources (CPU or memory), (2) fluctuating but stable = normal backpressure behavior. DDL operations and scaling operations also propagate via barriers, so their completion time is directly tied to barrier latency."
          />
          <MetricCard
            title="Barrier Number (In-Flight)"
            grafanaPath="Grafana (dev) → Streaming → Barrier Number"
            healthy="Low and stable count."
            warning="Sawtooth pattern — repeatedly climbs and drops. This means backpressure is kicking in sluggishly."
            critical="Monotonically increasing with no drops — system cannot keep up."
            notes="A sawtooth pattern happens when the source executor consumes a burst of data before backpressure activates. During backpressure, barriers pile up in the barrier channel. Once data finishes processing, all accumulated barriers are consumed quickly, then the cycle repeats. This is suboptimal but not catastrophic."
          />
          <MetricCard
            title="Barrier Sync Latency"
            grafanaPath="Grafana (dev) → Streaming → Barrier Sync Latency"
            healthy="Small fraction of total barrier latency."
            warning="Taking up a noticeable portion of barrier latency."
            critical="Dominates barrier latency — most time is spent flushing to object store."
            notes="If barrier sync latency is the dominant component, the bottleneck is either slow object store writes or an overwhelmed storage event handler. Check object store metrics and the uploader memory size next."
          />
        </div>
      );

    case "cpu":
      return (
        <div>
          <p style={prose}>
            Focus primarily on Streaming Node and Compactor Node CPU. Other components (meta, frontend) rarely become CPU bottlenecks. RisingWave reports CPU as a percentage where 100% = 1 core, so 8 CPUs means max is 800%.
          </p>
          <MetricCard
            title="Streaming Node CPU"
            grafanaPath="Grafana (dev) → Cluster Node → Node CPU → cpu usage (avg per core) - compute"
            healthy="Below 70% of allocated CPUs (e.g., < 560% for 8 cores)."
            warning="70-85% sustained — approaching saturation."
            critical="Above 85% sustained — throughput improvement likely with more CPUs."
            notes="Important caveat: low CPU does NOT mean you can safely scale down. If the bottleneck is slow state reads due to insufficient memory, the CPU may appear idle while the system is actually starved. Always cross-reference with cache miss ratios."
          />
          <MetricCard
            title="Compactor Node CPU"
            grafanaPath="Grafana (dev) → Cluster Node → Node CPU → cpu usage (avg per core) - compactor"
            healthy="Below 70% of allocated compactor CPUs."
            warning="Sustained high usage — check LSM pending bytes."
            critical="Fully saturated + LSM pending bytes growing = compaction can't keep up."
            notes="Recommended ratio: compute node cores to compactor cores = 2:1. Compactors are primarily CPU-bound, so you can get away with less memory (e.g., 4C 4GB is acceptable). Below 4 CPU / 8 GB for a compactor, prefer scaling up; above that threshold, scaling out is equally fine."
          />
        </div>
      );

    case "memory":
      return (
        <div>
          <p style={prose}>
            RisingWave has a built-in memory control mechanism. It reserves 30% of total memory as a safety buffer against spikes. The remaining 70% is "usable memory." Within usable memory, eviction kicks in at three escalating thresholds.
          </p>
          <div style={{ background: "#0c0e14", borderRadius: "8px", padding: "16px 18px", marginBottom: "16px", border: "1px solid #1e293b" }}>
            <div style={subhead}>Memory Allocation Model (example: 12 GB total)</div>
            <div style={{ fontFamily: "monospace", fontSize: "13px", color: "#94a3b8", lineHeight: 2 }}>
              <div>Total Memory: <strong style={{ color: "#e2e8f0" }}>12.0 GB</strong></div>
              <div>Reserved (30%): <span style={{ color: "#f87171" }}>3.6 GB</span> — buffer for spikes</div>
              <div>Usable (70%): <strong style={{ color: "#4ade80" }}>8.4 GB</strong></div>
              <div style={{ marginTop: "8px", borderTop: "1px solid #1e293b", paddingTop: "8px" }}>
                <div>70% of usable = <span style={{ color: "#4ade80" }}>5.88 GB</span> → No eviction below this</div>
                <div>80% of usable = <span style={{ color: "#facc15" }}>6.72 GB</span> → Graceful eviction starts</div>
                <div>90% of usable = <span style={{ color: "#f87171" }}>7.56 GB</span> → Intensified eviction</div>
              </div>
            </div>
          </div>
          <MetricCard
            title="Memory Usage"
            grafanaPath="Grafana (dev) → Cluster Node → Memory Usage"
            healthy="Below 70% of usable memory — all state is in-memory, no eviction triggered. You could even consider reducing memory to save costs."
            warning="Between 70-90% of usable memory — eviction is happening. Performance may benefit from more memory; check cache miss ratios to confirm."
            critical="Consistently at or above 90% of usable memory — constant intense eviction. Strongly consider adding memory."
            notes="High memory usage is expected in RisingWave — it deliberately uses available memory for caching. Don't panic at high absolute numbers. Instead, ask: is eviction being triggered, and if so, are cache miss ratios actually high? If cache misses are low despite eviction, the workload has good locality and more memory may not help much."
          />
        </div>
      );

    case "cache":
      return (
        <div>
          <p style={prose}>
            RisingWave has three layers of caching. Operator (executor) caches hold deserialized state for specific operators (join, agg, etc.). Block cache stores raw data blocks from SST files (64KB each). Meta cache stores file metadata used to locate data in object storage. The importance order for monitoring is: <strong style={{ color: "#e2e8f0" }}>meta cache → block cache → operator caches</strong>.
          </p>
          <MetricCard
            title="Executor Cache Miss Ratio (per operator type)"
            grafanaPath="Grafana (dev) → Streaming Actors → Executor Cache Miss Ratio"
            healthy="Below 5-10% miss rate. Example: 707 misses / 10.8K lookups ≈ 6% is quite good."
            warning="15-25% miss rate — moderate; more memory may help depending on locality."
            critical="Above 25% (e.g., 658/2.45K ≈ 27%) — high miss rate, strong signal that more memory would improve performance."
            notes="Each operator type (join, agg, etc.) has its own cache and separate miss metrics. Check them individually. The absolute number of misses matters as much as the ratio — each miss incurs a remote I/O to object storage."
          />
          <MetricCard
            title="Block (Data) Cache"
            grafanaPath="Grafana (dev) → Hummock (Read) → Cache Miss Ratio / Cache Size"
            healthy="Low miss ratio. Example: 9.52/401 ≈ 2% is excellent."
            warning="Rising miss ratio with high absolute miss count."
            critical="High miss ratio with large absolute numbers — each miss means an S3 round-trip."
            notes="Block cache is shared across all operators on a compute node. A high miss ratio alone isn't catastrophic — what matters is the absolute miss count × S3 latency. Scale up streaming node memory or tune cache configuration."
          />
          <MetricCard
            title="Meta Cache"
            grafanaPath="Grafana (dev) → Hummock (Read) → Cache Ops (meta_miss / data_miss)"
            healthy="meta_miss near 0%. Example: 0.203/90.2K ≈ 0.0002% is excellent."
            warning="Even small percentages matter here because the total lookup count is enormous (90K+ ops/sec). A tiny percentage can still mean thousands of expensive fetches."
            critical="Any sustained non-zero meta_miss — investigate immediately."
            notes="Every storage read goes through the meta cache first. The meta cache also has a bloom filter to skip unnecessary data reads. Because the total operation count is so high, even a 0.01% miss rate can cause significant overhead. Keep meta_miss as close to zero as possible."
          />
        </div>
      );

    case "compaction":
      return (
        <div>
          <p style={prose}>
            RisingWave uses Hummock, an LSM-tree based storage engine. Compaction merges and reorganizes SST files to maintain read performance and reclaim space. A falling-behind compactor degrades everything: read performance (more files to scan, more tombstones), write performance (write stalls), and memory usage.
          </p>
          <MetricCard
            title="LSM Compact Pending Bytes"
            grafanaPath="Grafana (dev) → Compaction → LSM Compact Pending Bytes"
            healthy="Stable or decreasing. Brief spikes are normal due to bursty workload nature."
            warning="Average above baseline for > 10 minutes — compaction is falling behind."
            critical="Sustained growth over 10+ minutes. Rule of thumb: divide average pending bytes by 4 GB to estimate ideal compactor CPU count."
            notes="Due to the bursty nature of compaction workload, only take action if pending bytes remain elevated for more than 10 minutes. Short spikes are expected and self-correcting."
          />
          <MetricCard
            title="Write Stall"
            grafanaPath="Grafana (dev) → Hummock Manager → Write Stop Compaction Groups"
            healthy="No data points in the panel. SQL query returns no rows."
            warning="Occasional brief write stalls."
            critical="Any persistent write stall — this blocks all streaming progress. Run: SELECT id, compaction_config->>'level0StopWriteThresholdSubLevelNumber' as threshold, active_write_limit FROM rw_hummock_compaction_group_configs WHERE active_write_limit IS NOT NULL;"
            notes="Write stalls happen when L0 sub-levels exceed the stop-write threshold (default 300). This is an emergency — scale compactors immediately. Check compactor CPU utilization and object store health. CN:compactor CPU ratio should be ~2:1."
          />
          <MetricCard
            title="Tombstones & Stale Keys"
            grafanaPath="Grafana (dev) → Hummock (Read) → Iter Keys Flow"
            healthy="skip_delete and skip_multi_version near zero relative to processed keys."
            warning="Noticeable skip counts — compaction is lagging on cleanup."
            critical="skip_delete or skip_multi_version significantly exceeding processed key counts."
            notes="Check the Epoch panel (Hummock Manager → Epoch). A large gap between safe_epoch/min_pinned_epoch and max_committed_epoch means old data can't be cleaned. Causes: long-running batch queries (check SHOW PROCESSLIST), or need to RECOVER / restart serving nodes."
          />
        </div>
      );

    case "backpressure":
      return (
        <div>
          <p style={prose}>
            Backpressure is RisingWave's flow control mechanism. When a downstream actor can't keep up, the bounded channel between actors fills up, and the upstream actor pauses. This propagates all the way back to the source executor, which then throttles consumption from the external system (Kafka, etc.). Backpressure is <em>essential</em> for stability — it prevents OOM and resource waste. But it also indicates a bottleneck that you may want to address.
          </p>
          <MetricCard
            title="Actor Output Blocking Time Ratio"
            grafanaPath="Grafana (dev) → Streaming Actors → Actor Output Blocking Time Ratio (Backpressure)"
            healthy="Low blocking ratios across all fragment pairs."
            warning="Some fragment pairs showing elevated blocking — identify the frontmost one."
            critical="Sustained high blocking ratio (near 1.0) — the downstream fragment is the bottleneck."
            notes="Backpressure propagates upstream, so if you see high blocking on channels 15002→15001 AND 15003→15002, the root cause is likely fragment 15001 (the most downstream one in the chain). Use the RisingWave Dashboard's Fragment panel + EXPLAIN CREATE MATERIALIZED VIEW to map fragment IDs to SQL query parts."
          />
          <MetricCard
            title="Join Executor Matched Rows"
            grafanaPath="Grafana (dev) → Streaming → Join Executor Matched Rows"
            healthy="Low and proportional match counts."
            warning="Some join keys producing disproportionate matches."
            critical="Extremely high matched rows (e.g., 200K+) — high join amplification. Check logs for 'high_join_amplification' warnings."
            notes="If a hot key causes amplification, split the MV using modulo on another column: e.g., create separate MVs for user_id % 7 = 0, 1, ..., 6, then UNION ALL. For hash-based splitting, account for negative hash values."
          />
          <div style={{ ...prose, marginTop: "8px" }}>
            <strong style={{ color: "#e2e8f0" }}>The Sawtooth Pattern explained:</strong> When backpressure is sluggish (large channel buffers), you'll see a repeating cycle: source ingests a burst → channel fills → backpressure activates → downstream processes the burst while barriers pile up → burst finishes → barriers consumed rapidly → cycle repeats. This creates sawtooth shapes in barrier number and fluctuating barrier latency. RisingWave mitigates this by limiting concurrent barrier messages in channels.
          </div>
        </div>
      );

    case "storage":
      return (
        <div>
          <p style={prose}>
            When executor caches miss, reads fall through to Hummock's storage layer. There are two read types: Get (point lookups, used by HashAgg) and Iter (range scans, used by HashJoin). Write bottlenecks manifest through the shared buffer (uploader memory).
          </p>
          <MetricCard
            title="Read Duration — Get Operations"
            grafanaPath="Grafana (dev) → Hummock (Read) → Read Duration (Get)"
            healthy="avg/p99 well under 10ms."
            warning="avg or p99 reaching 10-50ms."
            critical="avg/p99 consistently 100ms+ — investigate storage cache and object store."
          />
          <MetricCard
            title="Read Duration — Iter Operations"
            grafanaPath="Grafana (dev) → Hummock (Read) → Read Duration (Iter)"
            healthy="p99 well under 10ms. create_iter_time and pure_scan_time both low."
            warning="p99 reaching 10-50ms."
            critical="p99 consistently 100ms+ — check tombstones (Iter Keys Flow) and storage caches."
            notes="Iter duration is split into create_iter_time (metadata fetch, file pruning, initial seek) and pure_scan_time (actual data scanning). If create_iter_time dominates, the issue is metadata/meta cache. If pure_scan_time dominates, it's block cache or too many files to scan."
          />
          <MetricCard
            title="Uploader Memory Size (Shared Buffer)"
            grafanaPath="Grafana (dev) → Hummock (Write) → Uploader Memory Size"
            healthy="Well below the 4GB default cap."
            warning="Approaching the cap."
            critical="Consistently at or near 4GB — writes are being throttled. Also search CN logs for 'blocked at requiring memory'."
            notes="The shared buffer can only be released after data is flushed to object store. Causes of a full buffer: slow object store writes (check barrier sync latency), or an overwhelmed storage event handler (check Event Handler Pending Event Number). If the event count is consistently high, you have too many actors/state tables on one node — add more compute nodes."
          />
          <MetricCard
            title="Object Store Operations"
            grafanaPath="Grafana (dev) → Object Store → Operation Rate / Duration / Failure Rate / Retry Rate"
            healthy="Low duration, near-zero failure/retry rates."
            warning="Occasional duration spikes or retries."
            critical="Sustained high duration, persistent failures or retries, or >3000 OPS on S3 (triggers throttling)."
            notes="With S3, exceeding ~3000 OPS can cause latency spikes due to S3's own rate limits. To reduce OPS: add memory to compute nodes (fewer cache misses = fewer S3 reads). Persistent failures indicate misconfiguration or network issues — check CN/compactor logs."
          />
        </div>
      );

    case "source":
      return (
        <div>
          <p style={prose}>
            Source throughput tells you how fast data is being ingested. If throughput is low but there's no internal backpressure, the bottleneck is likely external — the upstream system itself can't deliver data fast enough.
          </p>
          <MetricCard
            title="Source Throughput (rows/sec)"
            grafanaPath="Grafana (dev) → Streaming → Source Throughput"
            healthy="Matches or exceeds the upstream production rate — no lag building."
            warning="Throughput lower than expected, with or without backpressure."
            critical="Significantly below upstream rate with growing consumer lag."
            notes="If throughput is low WITHOUT internal backpressure → the upstream (Kafka disk bandwidth, network between RW and Kafka, etc.) is the limiting factor. Monitor the upstream system's CPU, disk I/O, and network I/O. If throughput is low WITH high backpressure → RisingWave is the bottleneck (check CPU, memory, compaction)."
          />
        </div>
      );

    case "scaling":
      return (
        <div>
          <h3 style={heading}>Scale Up vs Scale Out: Decision Framework</h3>
          <p style={prose}>
            RisingWave generally <strong style={{ color: "#e2e8f0" }}>prefers scaling up over scaling out</strong> for compute nodes. Distributed systems inherently add network overhead and increase resource fragmentation. However, there are situations where scale-out is appropriate.
          </p>
          <div style={{ display: "grid", gap: "12px", marginBottom: "16px" }}>
            {[
              {
                title: "Compute Nodes — Prefer Scale Up",
                items: [
                  "If stateful queries (join, agg, over-window) dominate, scaling up avoids cross-node data shuffling overhead.",
                  "If queries are mostly stateless (simple ETL, no joins/aggs), scale-up and scale-out are equivalent.",
                  "Scale out when a single machine's resource ceiling is reached, or when you need to reduce actor count per node.",
                ],
              },
              {
                title: "Compactor Nodes — Depends on Size",
                items: [
                  "Below 4 CPU / 8 GB memory: ALWAYS scale up first — some compaction tasks need this minimum.",
                  "Above 4 CPU / 8 GB: scale up and scale out are equally fine.",
                  "Target ratio: compute cores : compactor cores ≈ 2:1.",
                  "Compactors are CPU-bound — you can save on memory (4C 4GB works).",
                ],
              },
              {
                title: "When Scaling is Triggered",
                items: [
                  "Streaming CPU > 85% sustained → add compute CPUs.",
                  "Memory > 90% usable + high cache miss → add compute memory.",
                  "LSM pending bytes elevated > 10 min → add compactor CPUs (avg_pending / 4GB = ideal CPU count).",
                  "Write stall detected → URGENT: scale compactors immediately.",
                  "Event handler pending events high → too many actors per node → add compute nodes (scale out).",
                  "S3 OPS > 3000 causing throttling → add compute memory (reduce cache misses).",
                ],
              },
            ].map((block) => (
              <div
                key={block.title}
                style={{
                  background: "#111318",
                  border: "1px solid #23272f",
                  borderRadius: "8px",
                  padding: "14px 16px",
                }}
              >
                <div style={{ fontSize: "13px", fontWeight: 700, color: "#60a5fa", marginBottom: "8px" }}>
                  {block.title}
                </div>
                {block.items.map((item, i) => (
                  <div key={i} style={{ fontSize: "13px", color: "#94a3b8", lineHeight: 1.7, paddingLeft: "12px", borderLeft: "2px solid #1e293b", marginBottom: "6px" }}>
                    {item}
                  </div>
                ))}
              </div>
            ))}
          </div>

          <h3 style={heading}>Scaling Procedure</h3>
          <div style={{ ...prose }}>
            On Kubernetes, scale compute nodes by adjusting the StatefulSet replica count. The meta node will automatically redistribute streaming actors. Scale <strong style={{ color: "#e2e8f0" }}>one node at a time</strong> and wait for barrier latency to stabilize before continuing. For scale-down, the meta node migrates actors gracefully — never scale below the minimum parallelism your streaming jobs require. Use <code style={{ background: "#1e293b", padding: "2px 6px", borderRadius: "4px", fontSize: "12px" }}>risectl</code> to inspect cluster state and manually trigger operations if needed.
          </div>
        </div>
      );

    case "resources":
      return (
        <div>
          <h3 style={heading}>Official Documentation Pages</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "20px" }}>
            {[
              { url: "https://docs.risingwave.com/performance/metrics", label: "Monitoring & Metrics", desc: "The page you've read — core KPI explanations" },
              { url: "https://docs.risingwave.com/performance/best-practices", label: "Best Practices", desc: "Resource allocation, data modeling, backfilling, MV-on-MV" },
              { url: "https://docs.risingwave.com/performance/troubleshoot-high-latency", label: "Troubleshoot: High Latency", desc: "Full diagnosis tree for slow streaming" },
              { url: "https://docs.risingwave.com/performance/specific-bottlenecks", label: "Specific Bottlenecks", desc: "Deep dives: CPU, state read/write, compaction, UDF, sinks, object store" },
              { url: "https://docs.risingwave.com/performance/workload-analysis", label: "Workload Analysis", desc: "Backpressure mechanics, barrier theory, sawtooth patterns" },
              { url: "https://docs.risingwave.com/performance/troubleshoot-e2e-latency", label: "End-to-End Latency", desc: "Processing time vs e2e latency, where delays accumulate" },
              { url: "https://docs.risingwave.com/performance/streaming-optimizations", label: "Streaming SQL Optimizations", desc: "Query-level improvements for streaming MVs" },
              { url: "https://docs.risingwave.com/performance/serving-optimizations", label: "Serving/Batch Optimizations", desc: "Optimizing batch/serving queries" },
              { url: "https://docs.risingwave.com/troubleshoot/troubleshoot-oom", label: "Troubleshoot: OOM", desc: "Out of memory diagnosis and prevention" },
              { url: "https://docs.risingwave.com/reference/data-persistence", label: "Data Persistence", desc: "Barriers and checkpoints explained" },
            ].map((link) => (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "block",
                  background: "#111318",
                  border: "1px solid #23272f",
                  borderRadius: "8px",
                  padding: "12px 16px",
                  textDecoration: "none",
                  transition: "border-color 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#3b82f6")}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#23272f")}
              >
                <div style={{ fontSize: "13px", fontWeight: 700, color: "#60a5fa" }}>{link.label}</div>
                <div style={{ fontSize: "12px", color: "#64748b", marginTop: "2px" }}>{link.desc}</div>
              </a>
            ))}
          </div>

          <h3 style={heading}>Tools & Community</h3>
          <div style={{ ...prose }}>
            <strong style={{ color: "#e2e8f0" }}>Grafana Dashboard Source</strong> — The definitive reference for what each panel measures. The Python scripts that generate them are at <code style={{ background: "#1e293b", padding: "2px 6px", borderRadius: "4px", fontSize: "12px" }}>github.com/risingwavelabs/risingwave/tree/main/grafana</code>. The dev dashboard (<code style={{ background: "#1e293b", padding: "2px 6px", borderRadius: "4px", fontSize: "12px" }}>risingwave-dev-dashboard.dashboard.py</code>) is recommended for production monitoring.
          </div>
          <div style={{ ...prose }}>
            <strong style={{ color: "#e2e8f0" }}>Await-Tree Analyzer</strong> — A web tool at <code style={{ background: "#1e293b", padding: "2px 6px", borderRadius: "4px", fontSize: "12px" }}>risingwavelabs.github.io/rw-diagnose-tools/</code> that helps identify bottlenecks in the await tree dump from your meta node dashboard (port 5691). Also self-hostable from the GitHub repo.
          </div>
          <div style={{ ...prose }}>
            <strong style={{ color: "#e2e8f0" }}>RisingWave Console</strong> — Built-in monitoring at the web UI with diagnostic collection. Alternative to Grafana for some use cases.
          </div>
          <div style={{ ...prose }}>
            <strong style={{ color: "#e2e8f0" }}>Slack Community</strong> — <code style={{ background: "#1e293b", padding: "2px 6px", borderRadius: "4px", fontSize: "12px" }}>risingwave.com/slack</code> — Active community with RW engineers responding to operational questions.
          </div>
        </div>
      );

    default:
      return null;
  }
}

export default function RisingWaveMetricsGuide() {
  const [activeSection, setActiveSection] = useState("overview");

  return (
    <div
      style={{
        fontFamily: "'IBM Plex Sans', -apple-system, sans-serif",
        background: "#0a0c10",
        color: "#e2e8f0",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet" />

      {/* Header */}
      <div
        style={{
          padding: "24px 24px 20px",
          borderBottom: "1px solid #1e293b",
          background: "linear-gradient(180deg, #0f1219 0%, #0a0c10 100%)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "6px" }}>
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "8px",
              background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "18px",
              fontWeight: 700,
              color: "#fff",
            }}
          >
            R
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: "18px", fontWeight: 700, letterSpacing: "-0.01em" }}>
              RisingWave Metrics Deep Dive
            </h1>
            <p style={{ margin: 0, fontSize: "12px", color: "#64748b" }}>
              Complete Grafana dashboard reference with health baselines & scaling playbook
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div
        style={{
          display: "flex",
          overflowX: "auto",
          gap: "4px",
          padding: "10px 16px",
          borderBottom: "1px solid #1e293b",
          background: "#0d0f14",
          scrollbarWidth: "none",
        }}
      >
        {SECTIONS.map((s) => (
          <button
            key={s.id}
            onClick={() => setActiveSection(s.id)}
            style={{
              flexShrink: 0,
              padding: "8px 14px",
              borderRadius: "6px",
              border: "none",
              cursor: "pointer",
              fontSize: "12px",
              fontWeight: activeSection === s.id ? 700 : 500,
              fontFamily: "inherit",
              background: activeSection === s.id ? "#1e293b" : "transparent",
              color: activeSection === s.id ? "#e2e8f0" : "#64748b",
              transition: "all 0.15s",
              whiteSpace: "nowrap",
            }}
          >
            <span style={{ marginRight: "5px" }}>{s.icon}</span>
            {s.title}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: "20px 20px 40px", maxWidth: "860px", width: "100%" }}>
        <div style={{ marginBottom: "16px" }}>
          <h2 style={{ margin: 0, fontSize: "20px", fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>
            {SECTIONS.find((s) => s.id === activeSection)?.icon}{" "}
            {SECTIONS.find((s) => s.id === activeSection)?.title}
          </h2>
          <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#64748b" }}>
            {SECTIONS.find((s) => s.id === activeSection)?.subtitle}
          </p>
        </div>
        <SectionContent id={activeSection} />
      </div>

      {/* Footer legend */}
      <div
        style={{
          padding: "12px 20px",
          borderTop: "1px solid #1e293b",
          display: "flex",
          gap: "16px",
          flexWrap: "wrap",
          fontSize: "11px",
          color: "#475569",
        }}
      >
        <span>Health zones: </span>
        <span><HealthBadge zone="healthy" /> No action needed</span>
        <span><HealthBadge zone="warning" /> Investigate / monitor</span>
        <span><HealthBadge zone="critical" /> Action required</span>
      </div>
    </div>
  );
}
