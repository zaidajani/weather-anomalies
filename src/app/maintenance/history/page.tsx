"use client";
import { CheckCircle2 } from "lucide-react";
import { useDemoStore } from "@/store/demo-store";
export default function Page() {
  const allRequests = useDemoStore((s) => s.requests);
  const requests = allRequests.filter((r) => r.status === "completed");
  const demoHistory = [
    {
      id: "HIS-26073-118",
      station: "AWS-GJ-104",
      sensor: "Rainfall",
      issue: "Gauge cleaned and recalibrated",
      date: "Today, 09:42",
    },
    {
      id: "HIS-26073-097",
      station: "AWS-KA-121",
      sensor: "Wind",
      issue: "Anemometer replaced",
      date: "Yesterday, 16:18",
    },
    {
      id: "HIS-26073-084",
      station: "AWS-MP-113",
      sensor: "Pressure",
      issue: "Barometer connector reseated",
      date: "12 Aug 2026",
    },
  ];
  return (
    <>
      <p className="eyebrow">Field record</p>
      <h1 className="mt-1 text-3xl font-bold tracking-tight">
        Maintenance history
      </h1>
      <div className="card mt-6 divide-y divide-[var(--line)] p-5">
        {demoHistory.map((item) => (
          <div className="flex items-start gap-3 py-3 first:pt-0" key={item.id}>
            <CheckCircle2 className="mt-1 text-emerald-600" size={18} />
            <div>
              <b>
                {item.station} · {item.sensor} maintenance completed
              </b>
              <p className="mt-1 text-sm text-zinc-500">
                {item.issue} · {item.date}
              </p>
            </div>
            <span className="status normal ml-auto">Resolved</span>
          </div>
        ))}
        {requests.map((r) => (
          <div className="flex items-start gap-3 py-3 last:pb-0" key={r.id}>
            <CheckCircle2 className="mt-1 text-emerald-600" size={18} />
            <div>
              <b>
                {r.stationId} · {r.sensor} calibration resolved
              </b>
              <p className="mt-1 text-sm text-zinc-500">
                Calibration completed · Sensor health restored
              </p>
            </div>
            <span className="status normal ml-auto">Resolved</span>
          </div>
        ))}
      </div>
    </>
  );
}
