"use client";
import { CheckCircle2 } from "lucide-react";
import { useDemoStore } from "@/store/demo-store";
export default function Page(){const requests=useDemoStore(s=>s.requests.filter(r=>r.status==='completed'));return <><p className="eyebrow">Field record</p><h1 className="mt-1 text-3xl font-bold tracking-tight">Maintenance history</h1><div className="card mt-6 p-5">{requests.length?requests.map(r=><div className="flex items-start gap-3" key={r.id}><CheckCircle2 className="mt-1 text-emerald-600"/><div><b>{r.stationId} · Temperature calibration resolved</b><p className="mt-1 text-sm text-zinc-500">Calibration completed · Sensor health restored to 96/100</p></div></div>):<p className="text-sm text-zinc-500">Completed work will appear here.</p>}</div></>}
