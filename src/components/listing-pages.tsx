"use client";
import Link from "next/link";
import {
  CheckCircle2,
  ChevronDown,
  CircleAlert,
  MapPin,
  Search,
  TriangleAlert,
  WifiOff,
} from "lucide-react";
import { useDemoStore } from "@/store/demo-store";
const Status = ({ type }: { type: string }) => (
  <span
    className={`status ${type === "critical" ? "critical" : type === "warning" ? "warning" : type === "offline" ? "neutral" : "normal"}`}
  >
    {type === "critical" ? (
      <CircleAlert size={11} />
    ) : type === "warning" ? (
      <TriangleAlert size={11} />
    ) : type === "offline" ? (
      <WifiOff size={11} />
    ) : (
      <CheckCircle2 size={11} />
    )}{" "}
    {type}
  </span>
);
const Filter = ({ children }: { children: React.ReactNode }) => (
  <button className="flex items-center gap-2 rounded-lg border border-[var(--line)] bg-white px-2.5 py-2 text-[10px] font-bold text-zinc-600">
    {children}
    <ChevronDown size={12} />
  </button>
);
export function StationsList({
  maintenance = false,
}: {
  maintenance?: boolean;
}) {
  const stations = useDemoStore((s) => s.stations);
  return (
    <>
      <div className="border-b border-[var(--line)] pb-5">
        <p className="eyebrow">
          {maintenance ? "Maintenance coverage" : "Network inventory"}
        </p>
        <h1 className="display mt-1 text-[28px] font-semibold">
          {maintenance ? "Assigned stations" : "Stations"}
        </h1>
        <p className="mt-1 text-[11px] text-zinc-500">
          Search, filter and inspect the live station network.
        </p>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <div className="command-search mr-auto w-[260px]">
          <Search size={14} />
          <span>Search station ID or location</span>
        </div>
        <Filter>All regions</Filter>
        <Filter>Health status</Filter>
        <Filter>Sensor type</Filter>
      </div>
      <div className="data-grid mt-4 overflow-x-auto">
        <table className="min-w-[810px]">
          <thead>
            <tr>
              {[
                "Station",
                "Location",
                "Operational status",
                "Last update",
                "Health",
                "Anomalies",
                "",
              ].map((x) => (
                <th key={x}>{x}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {stations.map((s) => (
              <tr key={s.id}>
                <td>
                  <b className="text-zinc-900">{s.id}</b>
                  <span className="mt-0.5 block text-[10px] text-zinc-500">
                    {s.name}
                  </span>
                </td>
                <td>
                  <span className="inline-flex items-center gap-1">
                    <MapPin size={12} />
                    {s.city}, {s.state}
                  </span>
                </td>
                <td>
                  <Status type={s.status} />
                </td>
                <td className="text-zinc-500">{s.lastUpdate}</td>
                <td>
                  <b className="display text-[15px] text-zinc-900">
                    {s.health || "—"}
                  </b>
                  {s.health > 0 && (
                    <span className="ml-1 text-[10px] text-zinc-400">
                      / 100
                    </span>
                  )}
                </td>
                <td>
                  {s.anomalies ? (
                    <span className="font-bold text-red-600">
                      {s.anomalies} active
                    </span>
                  ) : (
                    <span className="text-zinc-400">—</span>
                  )}
                </td>
                <td>
                  <Link
                    href={
                      s.id === "AWS-MH-042"
                        ? "/operator/anomalies/ANM-2026-0842"
                        : "/operator/dashboard"
                    }
                    className="text-[11px] font-bold text-violet-700"
                  >
                    Inspect →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
export function AnomaliesList() {
  const status = useDemoStore((s) => s.anomalyStatus);
  const rows = [
    [
      "AWS-MH-042",
      "Pune Observatory",
      "Temperature",
      "Calibration drift",
      "43.8°C vs 35.4°C expected",
      "critical",
      "96%",
      "Today, 12:58",
      "ANM-2026-0842",
    ],
    [
      "AWS-BR-129",
      "Patna Automatic AWS",
      "Humidity",
      "Sensor bias",
      "78% vs 61% expected",
      "critical",
      "91%",
      "Today, 12:41",
      "ANM-2026-0839",
    ],
    [
      "AWS-HR-168",
      "Hisar Regional AWS",
      "Pressure",
      "Barometer offset",
      "1018 hPa vs 1008 hPa expected",
      "critical",
      "88%",
      "Today, 12:20",
      "ANM-2026-0835",
    ],
    [
      "AWS-DL-014",
      "Ridge Station",
      "Temperature",
      "Thermal drift",
      "39.1°C vs 38.8°C expected",
      "warning",
      "79%",
      "Today, 11:56",
      "ANM-2026-0828",
    ],
    [
      "AWS-RJ-106",
      "Jaipur Automatic AWS",
      "Wind",
      "Intermittent packets",
      "Missing packets · 14%",
      "warning",
      "74%",
      "Today, 11:32",
      "ANM-2026-0822",
    ],
  ] as const;
  return (
    <>
      <div className="border-b border-[var(--line)] pb-5">
        <p className="eyebrow">Detection workflow</p>
        <h1 className="display mt-1 text-[28px] font-semibold">Anomalies</h1>
        <p className="mt-1 text-[11px] text-zinc-500">
          Prioritize, investigate and dispatch probable sensor faults.
        </p>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <div className="segmented mr-auto">
          <button className="active">All</button>
          <button>Critical</button>
          <button>Warning</button>
          <button>Investigating</button>
          <button>Resolved</button>
        </div>
        <Filter>Severity</Filter>
        <Filter>Status</Filter>
        <div className="command-search w-[210px]">
          <Search size={14} />
          <span>Search anomalies</span>
        </div>
      </div>
      <div className="data-grid mt-4 overflow-x-auto">
        <table className="min-w-[800px]">
          <thead>
            <tr>
              {[
                "Station",
                "Sensor",
                "Issue",
                "Severity",
                "Confidence",
                "Detected",
                "Status",
                "",
              ].map((x) => (
                <th key={x}>{x}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(
              ([
                station,
                location,
                sensor,
                issue,
                evidence,
                severity,
                confidence,
                detected,
                id,
              ]) => (
                <tr key={id}>
                  <td>
                    <b className="text-zinc-900">{station}</b>
                    <span className="mt-0.5 block text-[10px] text-zinc-500">
                      {location}
                    </span>
                  </td>
                  <td>{sensor}</td>
                  <td>
                    <b>{issue}</b>
                    <span className="mt-0.5 block text-[10px] text-zinc-500">
                      {evidence}
                    </span>
                  </td>
                  <td>
                    <Status type={severity} />
                  </td>
                  <td>
                    <b
                      className={
                        severity === "critical"
                          ? "text-red-600"
                          : "text-amber-700"
                      }
                    >
                      {confidence}
                    </b>
                  </td>
                  <td className="text-zinc-500">{detected}</td>
                  <td>
                    <Status
                      type={
                        id === "ANM-2026-0842" && status === "Resolved"
                          ? "normal"
                          : severity
                      }
                    />
                  </td>
                  <td>
                    <Link
                      href={`/operator/anomalies/${id === "ANM-2026-0842" ? id : "ANM-2026-0842"}`}
                      className="text-[11px] font-bold text-violet-700"
                    >
                      Open →
                    </Link>
                  </td>
                </tr>
              ),
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
