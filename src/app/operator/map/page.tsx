import { IndiaLiveMap } from "@/components/india-live-map";

export default function Page() {
  return <>
    <div className="flex flex-wrap items-end justify-between gap-3 border-b border-[var(--line)] pb-5">
      <div><p className="eyebrow">Network telemetry</p><h1 className="display mt-1 text-[28px] font-semibold">Live map</h1><p className="mt-1 text-[11px] text-zinc-500">Station availability and anomaly context across the India AWS network.</p></div>
      <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-500"><span className="size-1.5 animate-pulse rounded-full bg-emerald-500"/>Live telemetry</div>
    </div>
    <IndiaLiveMap />
  </>;
}
