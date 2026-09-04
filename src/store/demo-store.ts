"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { anomalies as seedAnomalies, stations as seedStations, type MaintenanceRequest, type RequestStatus, type Station } from "@/lib/data";

type DemoState = { stations:Station[]; requests:MaintenanceRequest[]; anomalyStatus:string; createRequest:()=>void; updateRequest:(id:string,status:RequestStatus, notes?:string)=>void; reset:()=>void };
const initial = () => ({ stations:seedStations, requests:[] as MaintenanceRequest[], anomalyStatus:"New" });
export const useDemoStore = create<DemoState>()(persist((set) => ({ ...initial(), createRequest:()=>set((s)=> s.requests.length ? s : ({ requests:[{id:"MR-26073-042",anomalyId:seedAnomalies[0].id,stationId:"AWS-MH-042",sensor:"Temperature",priority:"critical",diagnosis:"Probable calibration drift",confidence:96,status:"new",createdAt:"Today, 13:04"}], anomalyStatus:"Maintenance Requested" })), updateRequest:(id,status,notes)=>set((s)=>{ const completed=status==="completed"; return { requests:s.requests.map(r=>r.id===id?{...r,status,notes,calibrationPerformed:completed}:r), anomalyStatus:completed?"Resolved":s.anomalyStatus, stations:completed?s.stations.map(st=>st.id==="AWS-MH-042"?{...st,status:"normal",health:94,temperature:35.6,anomalies:0}:st):s.stations }; }), reset:()=>set(initial()) }), { name:"weather-anomalies-demo-v1" }));
