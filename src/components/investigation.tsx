"use client";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  CircleAlert,
  MapPin,
  Sparkles,
  Wrench,
} from "lucide-react";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { trend } from "@/lib/data";
import { useState } from "react";
import { useDemoStore } from "@/store/demo-store";

type SensorMetric =
  "Temperature" | "Humidity" | "Pressure" | "Rainfall" | "Wind";
const sensorMetrics: SensorMetric[] = [
  "Temperature",
  "Humidity",
  "Pressure",
  "Rainfall",
  "Wind",
];
const metricValues: Record<
  SensorMetric,
  { unit: string; observed: number; expected: number; nearby: number }
> = {
  Temperature: { unit: "°C", observed: 43.8, expected: 35.4, nearby: 35.1 },
  Humidity: { unit: "%", observed: 78, expected: 61, nearby: 60 },
  Pressure: { unit: " hPa", observed: 1018, expected: 1008, nearby: 1007 },
  Rainfall: { unit: " mm", observed: 12.6, expected: 4.2, nearby: 4.5 },
  Wind: { unit: " km/h", observed: 24.8, expected: 13.5, nearby: 14.1 },
};
const metricTrend = (metric: SensorMetric) =>
  metric === "Temperature"
    ? trend
    : trend.map((point, index) => ({
        time: point.time,
        expected: Number(
          (metricValues[metric].expected + Math.sin(index * 0.8) * 0.7).toFixed(
            1,
          ),
        ),
        actual: Number(
          (
            metricValues[metric].expected +
            (metricValues[metric].observed - metricValues[metric].expected) *
              ((index + 1) / trend.length)
          ).toFixed(1),
        ),
      }));
export function Investigation() {
  const [metric, setMetric] = useState<SensorMetric>("Temperature");
  const [resolution, setResolution] = useState<"fixed" | "part-change" | null>(
    null,
  );
  const create = useDemoStore((s) => s.createRequest);
  const request = useDemoStore((s) => s.requests[0]);
  const status = useDemoStore((s) => s.anomalyStatus);
  const values = metricValues[metric];
  const graph = metricTrend(metric);
  return (
    <>
      <Link
        href="/operator/anomalies"
        className="inline-flex items-center gap-1 text-[11px] font-bold text-zinc-500 hover:text-zinc-900"
      >
        <ArrowLeft size={14} />
        Anomalies
      </Link>
      <div className="mt-4 flex flex-wrap items-end justify-between gap-3 border-b border-[var(--line)] pb-5">
        <div>
          <p className="eyebrow">Investigation · ANM-2026-0842</p>
          <h1 className="display mt-1 text-[28px] font-semibold">
            AWS-MH-042 / temperature anomaly
          </h1>
          <p className="mt-2 flex items-center gap-1 text-[11px] text-zinc-500">
            <MapPin size={13} />
            Pune Observatory, Maharashtra · Last sync 1 min ago
          </p>
        </div>
        <span
          className={`status ${status === "Resolved" ? "normal" : "critical"}`}
        >
          <CircleAlert size={12} />
          {status}
        </span>
      </div>
      <div className="metric-band mt-5 grid-cols-4">
        {[
          [
            "Observed",
            `${values.observed}${values.unit}`,
            "Out of expected range",
            "critical",
          ],
          [
            "Expected",
            `${values.expected}${values.unit}`,
            "Baseline model",
            "neutral",
          ],
          [
            "Nearby mean",
            `${values.nearby}${values.unit}`,
            "Three peer stations",
            "normal",
          ],
          [
            "Confidence",
            metric === "Temperature" ? "96%" : "82%",
            metric === "Temperature" ? "Probable fault" : "Signal review",
            "normal",
          ],
        ].map(([a, b, c, d]) => (
          <div key={a}>
            <p className="eyebrow">{a}</p>
            <p className="metric">{b}</p>
            <span className={`status mt-2 ${d}`}>{c}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 grid gap-4 xl:grid-cols-[1.45fr_.8fr]">
        <section className="panel overflow-hidden">
          <div className="flex items-center justify-between border-b border-[var(--line)] px-5 py-4">
            <div>
              <p className="eyebrow">Temporal validation</p>
              <h2 className="panel-heading mt-1">
                Actual vs expected {metric.toLowerCase()}
              </h2>
            </div>
            <div className="segmented">
              {sensorMetrics.map((item) => (
                <button
                  key={item}
                  className={metric === item ? "active" : ""}
                  onClick={() => setMetric(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          <div className="h-[300px] bg-gradient-to-b from-violet-50/50 to-white px-2 py-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={graph}
                margin={{ left: -20, right: 20, top: 12, bottom: 5 }}
              >
                <XAxis
                  dataKey="time"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: "#90938c" }}
                />
                <YAxis
                  domain={[30, 46]}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: "#90938c" }}
                />
                <Tooltip
                  contentStyle={{
                    border: "1px solid #e5e6e1",
                    borderRadius: 8,
                    fontSize: 11,
                  }}
                />
                <Line
                  dataKey="expected"
                  stroke="#90938c"
                  strokeDasharray="4 4"
                  strokeWidth={2}
                />
                <Line
                  dataKey="actual"
                  stroke="#bf3e42"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: "#bf3e42" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="flex gap-4 border-t border-[var(--line)] px-5 py-3 text-[10px] font-bold text-zinc-500">
            <span className="flex items-center gap-1">
              <i className="h-0.5 w-3 bg-red-500" />
              Observed reading
            </span>
            <span className="flex items-center gap-1">
              <i className="h-0.5 w-3 border-t border-dashed border-zinc-400" />
              Expected baseline
            </span>
          </div>
        </section>
        <section className="panel soft-aurora p-5">
          <div className="flex items-center gap-2">
            <span className="grid size-7 place-items-center rounded-md border border-violet-100 bg-white text-violet-600">
              <Sparkles size={14} />
            </span>
            <p className="eyebrow">AI diagnostic</p>
          </div>
          <h2 className="display mt-4 text-[21px] font-semibold">
            Probable calibration drift
          </h2>
          <p className="mt-2 text-[11px] leading-5 text-zinc-600">
            The target sensor diverges rapidly while nearby stations and related
            telemetry remain within expected bounds.
          </p>
          <div className="mt-5 divide-y divide-[var(--line)] border-y border-[var(--line)] bg-white/65">
            {[
              ["Temporal deviation", "HIGH", "critical"],
              ["Cross-sensor mismatch", "HIGH", "critical"],
              ["Spatial disagreement", "VERY HIGH", "critical"],
              ["Missing packets", "LOW", "neutral"],
            ].map(([a, b, c]) => (
              <div
                className="flex items-center justify-between py-3 text-[11px]"
                key={a}
              >
                <span className="font-bold text-zinc-600">{a}</span>
                <span className={`status ${c}`}>{b}</span>
              </div>
            ))}
          </div>
          <Link
            href="/operator/map"
            className="mt-4 flex items-center justify-between text-[11px] font-bold text-violet-700"
          >
            Compare nearby stations <span>→</span>
          </Link>
        </section>
      </div>
      <section className="panel mt-4 flex flex-wrap items-center justify-between gap-4 px-5 py-4">
        <div>
          <p className="eyebrow">Recommended action</p>
          <h2 className="panel-heading mt-1">
            Inspect and recalibrate the temperature sensor
          </h2>
          <p className="mt-1 text-[11px] text-zinc-500">
            The work order propagates immediately to Maintenance Portal.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-2">
          <button
            onClick={() => setResolution("fixed")}
            className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2.5 text-[11px] font-bold ${resolution === "fixed" ? "border-emerald-600 bg-emerald-600 text-white" : "border-emerald-200 bg-emerald-50 text-emerald-700"}`}
          >
            <CheckCircle2 size={15} />
            {resolution === "fixed" ? "Marked fixed" : "Mark fixed"}
          </button>
          <button
            onClick={() => setResolution("part-change")}
            className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2.5 text-[11px] font-bold ${resolution === "part-change" ? "border-amber-500 bg-amber-500 text-white" : "border-amber-200 bg-amber-50 text-amber-700"}`}
          >
            <Wrench size={15} />
            {resolution === "part-change"
              ? "Part change underway"
              : "Mark undergoing part change"}
          </button>
          {request ? (
            <Link
              href={`/maintenance/requests/${request.id}`}
              className="inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-3 py-2.5 text-[11px] font-bold text-white"
            >
              <CheckCircle2 size={15} />
              View work order
            </Link>
          ) : (
            <button
              onClick={create}
              className="inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-3 py-2.5 text-[11px] font-bold text-white"
            >
              <Wrench size={15} />
              Create maintenance request
            </button>
          )}
        </div>
      </section>
    </>
  );
}
