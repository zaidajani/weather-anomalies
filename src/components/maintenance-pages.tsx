"use client";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  CircleAlert,
  ClipboardList,
  Wrench,
} from "lucide-react";
import { useDemoStore } from "@/store/demo-store";
export function MaintenanceDashboard() {
  const requests = useDemoStore((s) => s.requests);
  const liveRequest = requests[0];
  const tasks = [
    {
      id: "MR-26073-042",
      station: "AWS-MH-042",
      sensor: "Temperature",
      title: "Calibration drift",
      priority: "critical",
      confidence: "96%",
      status: liveRequest?.status ?? "new",
      href: liveRequest
        ? `/maintenance/requests/${liveRequest.id}`
        : "/operator/anomalies/ANM-2026-0842",
    },
    {
      id: "MR-26073-129",
      station: "AWS-BR-129",
      sensor: "Humidity",
      title: "Sensor bias inspection",
      priority: "high",
      confidence: "91%",
      status: "accepted",
      href: "/maintenance/requests",
    },
    {
      id: "MR-26073-168",
      station: "AWS-HR-168",
      sensor: "Pressure",
      title: "Barometer offset check",
      priority: "medium",
      confidence: "88%",
      status: "new",
      href: "/maintenance/requests",
    },
  ];
  const completed = requests.filter((r) => r.status === "completed").length;
  const stats = [
    ["Assigned stations", "26", "Across 4 regions"],
    [
      "Open requests",
      String(tasks.filter((t) => t.status !== "completed").length),
      "Awaiting field action",
    ],
    [
      "Critical tasks",
      String(
        tasks.filter(
          (t) => t.priority === "critical" && t.status !== "completed",
        ).length,
      ),
      "Immediate attention",
      "critical-text",
    ],
    [
      "In progress",
      String(requests.filter((r) => r.status === "in-progress").length),
      "Technician on site",
    ],
    ["Resolved", String(completed), "This week", "green-text"],
  ];
  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[var(--line)] pb-5">
        <div>
          <p className="eyebrow">Field operations</p>
          <h1 className="display mt-1 text-[28px] font-semibold">
            Maintenance command center
          </h1>
          <p className="mt-1 text-[11px] text-zinc-500">
            Prioritize work orders, validate repair outcomes and restore station
            health.
          </p>
        </div>
        <div className="rounded-lg border border-[var(--line)] bg-white px-4 py-3">
          <p className="eyebrow">Assigned zone</p>
          <p className="mt-1 text-[13px] font-bold text-zinc-900">
            West & Central India
          </p>
          <p className="mt-1 text-[10px] text-zinc-500">
            Maharashtra · Gujarat · Madhya Pradesh · Goa
          </p>
        </div>
      </div>
      <section className="metric-band mt-5">
        {stats.map(([a, b, c, d]) => (
          <div key={a}>
            <p className="eyebrow">{a}</p>
            <p className="metric">{b}</p>
            <p className={`submetric ${d ?? ""}`}>{c}</p>
          </div>
        ))}
      </section>
      <div className="mt-4 grid gap-4 xl:grid-cols-[1.45fr_.8fr]">
        <section className="panel overflow-hidden">
          <div className="flex items-center justify-between border-b border-[var(--line)] px-5 py-4">
            <div>
              <p className="eyebrow">Priority queue</p>
              <h2 className="panel-heading mt-1">Assigned field tasks</h2>
            </div>
            <ClipboardList size={17} className="text-zinc-400" />
          </div>
          <div className="divide-y divide-[var(--line)]">
            {tasks.map((task) => (
              <Link
                key={task.id}
                href={task.href}
                className="flex items-center gap-4 px-5 py-4 hover:bg-zinc-50"
              >
                <span
                  className={`grid size-9 place-items-center rounded-lg ${task.priority === "critical" ? "bg-red-50 text-red-600" : task.priority === "high" ? "bg-amber-50 text-amber-600" : "bg-zinc-100 text-zinc-600"}`}
                >
                  <CircleAlert size={17} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`status ${task.priority === "critical" ? "critical" : task.priority === "high" ? "warning" : "neutral"}`}
                    >
                      {task.priority}
                    </span>
                    <span className="text-[10px] font-bold text-zinc-400">
                      {task.id}
                    </span>
                  </div>
                  <b className="mt-1.5 block text-[12px]">
                    {task.station} · {task.sensor}
                  </b>
                  <p className="mt-0.5 text-[10px] text-zinc-500">
                    {task.title} · {task.confidence} confidence
                  </p>
                </div>
                <span className="text-right">
                  <span
                    className={`status ${task.status === "completed" ? "normal" : task.status === "in-progress" ? "warning" : "neutral"}`}
                  >
                    {task.status}
                  </span>
                  <span className="mt-1 block text-[10px] font-bold text-violet-700">
                    Open <ArrowRight size={13} className="inline" />
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </section>
        <section className="panel soft-aurora p-5">
          <p className="eyebrow">Station health</p>
          <p className="display mt-2 text-[36px] font-semibold">91.8%</p>
          <p className="mt-1 text-[11px] text-zinc-500">
            Assigned-station health score
          </p>
          <div className="mt-5 flex h-1.5 overflow-hidden rounded-full bg-white/70">
            <span className="w-[72%] bg-emerald-500" />
            <span className="w-[20%] bg-amber-400" />
            <span className="w-[8%] bg-red-500" />
          </div>
          <div className="mt-3 flex justify-between text-[9px] font-bold text-zinc-500">
            <span>Healthy 72%</span>
            <span>At risk 28%</span>
          </div>
        </section>
      </div>
    </>
  );
}
export function Requests() {
  const requests = useDemoStore((s) => s.requests);
  return (
    <>
      <div className="border-b border-[var(--line)] pb-5">
        <p className="eyebrow">Work orders</p>
        <h1 className="display mt-1 text-[28px] font-semibold">
          Maintenance requests
        </h1>
        <p className="mt-1 text-[11px] text-zinc-500">
          Manage priority, technician status and recommended action.
        </p>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <div className="segmented mr-auto">
          <button className="active">All</button>
          <button>New</button>
          <button>Accepted</button>
          <button>In progress</button>
          <button>Completed</button>
        </div>
        <button className="rounded-lg border border-[var(--line)] bg-white px-3 text-[10px] font-bold text-zinc-600">
          Priority ▾
        </button>
        <button className="rounded-lg border border-[var(--line)] bg-white px-3 text-[10px] font-bold text-zinc-600">
          Technician ▾
        </button>
      </div>
      <div className="data-grid mt-4 overflow-x-auto">
        <table className="min-w-[780px]">
          <thead>
            <tr>
              {[
                "Station / sensor",
                "Fault diagnosis",
                "Priority",
                "Confidence",
                "Status",
                "Assigned",
                "",
              ].map((x) => (
                <th key={x}>{x}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {requests.map((r) => (
              <tr key={r.id}>
                <td>
                  <b className="text-zinc-900">{r.stationId}</b>
                  <span className="mt-0.5 block text-[10px] text-zinc-500">
                    {r.sensor} · {r.id}
                  </span>
                </td>
                <td>
                  <b>{r.diagnosis}</b>
                  <span className="mt-0.5 block text-[10px] text-zinc-500">
                    AI recommendation: recalibrate
                  </span>
                </td>
                <td>
                  <span className="status critical">{r.priority}</span>
                </td>
                <td>
                  <b className="text-red-600">{r.confidence}%</b>
                </td>
                <td>
                  <span
                    className={`status ${r.status === "completed" ? "normal" : r.status === "in-progress" ? "warning" : "neutral"}`}
                  >
                    {r.status}
                  </span>
                </td>
                <td>{r.technician ?? "Unassigned"}</td>
                <td>
                  <Link
                    href={`/maintenance/requests/${r.id}`}
                    className="text-[11px] font-bold text-violet-700"
                  >
                    Open →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!requests.length && (
          <div className="p-10 text-center text-[11px] text-zinc-500">
            No requests in this queue yet.
          </div>
        )}
      </div>
    </>
  );
}
export function RequestDetail() {
  const req = useDemoStore((s) => s.requests[0]);
  const update = useDemoStore((s) => s.updateRequest);
  if (!req)
    return (
      <div className="panel p-8 text-[12px]">
        No request found. Create one from the Operator Portal.
      </div>
    );
  const next =
    req.status === "new"
      ? "accepted"
      : req.status === "accepted"
        ? "in-progress"
        : "completed";
  const label =
    req.status === "new"
      ? "Accept request"
      : req.status === "accepted"
        ? "Start work"
        : req.status === "in-progress"
          ? "Complete calibration"
          : "Calibration complete";
  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-[var(--line)] pb-5">
        <div>
          <p className="eyebrow">Work order · {req.id}</p>
          <h1 className="display mt-1 text-[28px] font-semibold">
            AWS-MH-042 / temperature sensor
          </h1>
          <p className="mt-1 text-[11px] text-zinc-500">
            Pune Observatory · critical calibration task
          </p>
        </div>
        <span
          className={`status ${req.status === "completed" ? "normal" : "critical"}`}
        >
          {req.status}
        </span>
      </div>
      <div className="mt-4 grid gap-4 xl:grid-cols-[1.25fr_.75fr]">
        <section className="panel overflow-hidden">
          <div className="border-b border-[var(--line)] px-5 py-4">
            <p className="eyebrow">AI diagnosis</p>
            <h2 className="panel-heading mt-1">
              Probable calibration drift · 96% confidence
            </h2>
          </div>
          <div className="grid grid-cols-3 divide-x divide-[var(--line)] border-b border-[var(--line)]">
            <div className="p-4">
              <p className="eyebrow">Observed</p>
              <b className="display mt-1 block text-[21px] text-red-600">
                43.8°
              </b>
            </div>
            <div className="p-4">
              <p className="eyebrow">Expected</p>
              <b className="display mt-1 block text-[21px]">35.4°</b>
            </div>
            <div className="p-4">
              <p className="eyebrow">Peer mean</p>
              <b className="display mt-1 block text-[21px]">35.1°</b>
            </div>
          </div>
          <p className="p-5 text-[11px] leading-5 text-zinc-600">
            Recommended action: inspect the probe and recalibrate against a
            validated reference. Spatial disagreement is very high while packet
            loss remains low.
          </p>
        </section>
        <section className="panel soft-aurora p-5">
          <p className="eyebrow">Technician workflow</p>
          <div className="mt-5 space-y-2">
            {[
              "Request accepted",
              "Field work started",
              "Calibration verified",
            ].map((x, i) => {
              const active =
                req.status === "completed" ||
                (req.status === "in-progress" && i < 2) ||
                (req.status === "accepted" && i < 1);
              return (
                <div className="flex items-center gap-2" key={x}>
                  <span
                    className={`grid size-5 place-items-center rounded-full text-[9px] ${active ? "bg-emerald-500 text-white" : "border border-zinc-300 bg-white text-zinc-400"}`}
                  >
                    {active ? "✓" : i + 1}
                  </span>
                  <span
                    className={`text-[11px] font-bold ${active ? "text-zinc-800" : "text-zinc-400"}`}
                  >
                    {x}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="mt-5 border-y border-[var(--line)] bg-white/60 py-3 text-[11px]">
            <b>Work performed</b>
            <p className="mt-1 text-zinc-500">
              Probe inspection and calibration against reference.
            </p>
          </div>
          <button
            disabled={req.status === "completed"}
            onClick={() =>
              update(req.id, next, "Calibration completed against reference")
            }
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-3 py-2.5 text-[11px] font-bold text-white disabled:bg-emerald-700"
          >
            <CheckCircle2 size={15} />
            {label}
          </button>
        </section>
      </div>
    </>
  );
}
