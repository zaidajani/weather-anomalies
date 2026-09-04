"use client";
import { useMemo, useState } from "react";
import Map, { Marker, NavigationControl, Popup } from "react-map-gl/maplibre";
import {
  Activity,
  Layers3,
  LocateFixed,
  MapPin,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceArea,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import "maplibre-gl/dist/maplibre-gl.css";
import type { Station } from "@/lib/data";
import { useDemoStore } from "@/store/demo-store";

type Mode = "all" | "faulty";
type Sensor = "Temperature" | "Humidity" | "Pressure" | "Rainfall" | "Wind";
const sensors: Sensor[] = [
  "Temperature",
  "Humidity",
  "Pressure",
  "Rainfall",
  "Wind",
];
const baseStyle = {
  version: 8 as const,
  sources: {
    osm: {
      type: "raster" as const,
      tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
      tileSize: 256,
      attribution: "© OpenStreetMap contributors",
    },
  },
  layers: [{ id: "osm", type: "raster" as const, source: "osm" }],
};
const hue = (s: Station["status"]) =>
  ({
    normal: "bg-emerald-500",
    warning: "bg-amber-400",
    critical: "bg-red-500",
    offline: "bg-zinc-400",
  })[s];
const faulty = (s: Station) =>
  s.status === "critical" || s.status === "warning";
const reading = (s: Station, k: Sensor) =>
  ({
    Temperature: `${s.temperature || "—"}°C`,
    Humidity: `${44 + (s.health % 14)}%`,
    Pressure: `${1005 + (s.health % 8)} hPa`,
    Rainfall: `${(s.anomalies * 0.8 + 0.2).toFixed(1)} mm`,
    Wind: `${8 + (s.health % 11)} km/h`,
  })[k];
function series(s: Station, k: Sensor) {
  const base =
    k === "Temperature"
      ? s.expected
      : k === "Humidity"
        ? 48
        : k === "Pressure"
          ? 1009
          : k === "Rainfall"
            ? 0.4
            : 14;
  return Array.from({ length: 96 }, (_, i) => {
    const expected = Number(
      (base + Math.sin(i / 7) * (k === "Pressure" ? 1.2 : 1.1)).toFixed(1),
    );
    const drift = s.id === "AWS-MH-042" && k === "Temperature" && i >= 72;
    return {
      i,
      value: Number(
        (
          expected +
          (drift ? Math.min(8.4, (i - 71) * 0.38) : Math.cos(i / 5) * 0.25)
        ).toFixed(1),
      ),
      expected,
    };
  });
}
function SensorModal({
  station,
  close,
}: {
  station: Station;
  close: () => void;
}) {
  const [sensor, setSensor] = useState<Sensor>("Temperature");
  const graph = useMemo(() => series(station, sensor), [station, sensor]);
  const bad = station.id === "AWS-MH-042" && sensor === "Temperature";
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-zinc-950/35 p-5 backdrop-blur-sm">
      <div className="w-full max-w-5xl overflow-hidden rounded-xl border border-white bg-white shadow-[0_24px_70px_rgba(20,20,20,.28)]">
        <header className="soft-aurora flex justify-between border-b border-[var(--line)] px-6 py-5">
          <div>
            <p className="eyebrow">Station telemetry · 96-hour analysis</p>
            <h2 className="display mt-1 text-[24px] font-semibold">
              {station.id} <span className="font-normal text-zinc-400">/</span>{" "}
              {station.name}
            </h2>
            <p className="mt-1 text-[11px] text-zinc-500">
              {station.city}, {station.state} · Last synced {station.lastUpdate}
            </p>
          </div>
          <button onClick={close} className="icon-button" aria-label="Close">
            <X size={16} />
          </button>
        </header>
        <div className="grid lg:grid-cols-[220px_minmax(0,1fr)]">
          <aside className="border-b border-[var(--line)] bg-[#fafaf9] p-4 lg:border-b-0 lg:border-r">
            <p className="eyebrow px-2 pb-2">Sensors</p>
            {sensors.map((k) => (
              <button
                key={k}
                onClick={() => setSensor(k)}
                className={`flex w-full items-center justify-between rounded-lg px-2.5 py-2.5 text-[11px] font-bold ${sensor === k ? "border border-violet-100 bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:bg-white"}`}
              >
                <span>{k}</span>
                <span
                  className={
                    bad && k === "Temperature"
                      ? "text-red-600"
                      : "text-zinc-700"
                  }
                >
                  {reading(station, k)}
                </span>
              </button>
            ))}
            <div className="mt-4 border-t border-[var(--line)] px-2 pt-4">
              <p className="eyebrow">Station health</p>
              <p
                className={`display mt-1 text-[25px] ${station.status === "critical" ? "text-red-600" : ""}`}
              >
                {station.health || "—"}
                <span className="ml-1 text-[12px] text-zinc-400">/100</span>
              </p>
            </div>
          </aside>
          <section className="min-w-0 p-5">
            <div className="flex justify-between">
              <div>
                <p className="eyebrow">{sensor} / observed versus expected</p>
                <h3 className="panel-heading mt-1">Previous 96 hours</h3>
              </div>
              <span className={`status ${bad ? "critical" : "normal"}`}>
                {bad ? "Fault detected" : "Within expected range"}
              </span>
            </div>
            {bad && (
              <div className="mt-4 flex gap-3 border-l-2 border-red-500 bg-red-50 px-3 py-2.5 text-[11px] leading-5 text-red-800">
                <Activity size={15} className="mt-0.5 shrink-0" />
                <p>
                  <b>Calibration drift begins at hour 72.</b> The observed
                  temperature rises to 43.8°C while the expected model remains
                  around 35.4°C; nearby stations average 35.1°C.
                </p>
              </div>
            )}
            <div className="mt-4 h-[310px] rounded-lg border border-[var(--line)] bg-gradient-to-b from-violet-50/45 to-white p-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={graph}
                  margin={{ top: 15, right: 18, left: -22, bottom: 4 }}
                >
                  <CartesianGrid
                    vertical={false}
                    stroke="#eceee9"
                    strokeDasharray="2 4"
                  />
                  <XAxis
                    dataKey="i"
                    tickFormatter={(v) =>
                      v % 24 === 0 ? `D${v / 24 + 1}` : ""
                    }
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 9, fill: "#8b8e87" }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 9, fill: "#8b8e87" }}
                  />
                  <Tooltip
                    contentStyle={{
                      border: "1px solid #e5e6e1",
                      borderRadius: 8,
                      fontSize: 11,
                    }}
                  />
                  {bad && (
                    <ReferenceArea
                      x1={72}
                      x2={95}
                      fill="#fecdd3"
                      fillOpacity={0.46}
                      label={{
                        value: "Fault interval",
                        position: "insideTop",
                        fill: "#be123c",
                        fontSize: 10,
                      }}
                    />
                  )}
                  <Line
                    type="monotone"
                    dataKey="expected"
                    stroke="#8a8d86"
                    strokeDasharray="4 4"
                    strokeWidth={1.5}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke={bad ? "#c53d47" : "#2f322e"}
                    strokeWidth={2.2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3 flex gap-4 text-[10px] font-bold text-zinc-500">
              <span>— Observed {sensor.toLowerCase()}</span>
              <span>┈ Expected behavior</span>
              {bad && (
                <span className="text-red-600">
                  Shaded = confirmed deviation
                </span>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export function IndiaLiveMap() {
  const stations = useDemoStore((s) => s.stations);
  const [mode, setMode] = useState<Mode>("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Station | null>(
    stations.find((s) => s.id === "AWS-MH-042") ?? null,
  );
  const [inspect, setInspect] = useState<Station | null>(null);
  const matched = useMemo(
    () =>
      stations.filter((s) =>
        `${s.id} ${s.name} ${s.city} ${s.state}`
          .toLowerCase()
          .includes(search.toLowerCase()),
      ),
    [stations, search],
  );
  const visible = mode === "faulty" ? matched.filter(faulty) : matched;
  const mapStyle = baseStyle;
  return (
    <>
      <section className="panel mt-4 overflow-hidden">
        <div className="flex flex-wrap items-center gap-2 border-b border-[var(--line)] bg-white px-4 py-3">
          <label className="command-search mr-auto w-[290px]">
            <Search size={14} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search station or location"
              className="min-w-0 flex-1 border-0 bg-transparent text-[11px] outline-none placeholder:text-zinc-400"
            />
          </label>
          <button className="icon-button">
            <SlidersHorizontal size={15} />
          </button>
          <button className="icon-button">
            <LocateFixed size={15} />
          </button>
        </div>
        <div className="relative h-[clamp(340px,calc(100dvh-270px),680px)]">
          <Map
            initialViewState={{ longitude: 79, latitude: 22.7, zoom: 3.95 }}
            minZoom={3.2}
            mapStyle={mapStyle}
            style={{ width: "100%", height: "100%" }}
          >
            <NavigationControl position="bottom-right" showCompass={false} />
            {visible.map((s) => (
              <Marker
                key={s.id}
                longitude={s.longitude}
                latitude={s.latitude}
                anchor="center"
                onClick={(e) => {
                  e.originalEvent.stopPropagation();
                  setSelected(s);
                }}
              >
                <button className="relative grid size-5 place-items-center rounded-full border-2 border-white shadow-[0_2px_7px_rgba(0,0,0,.28)]">
                  {s.status === "critical" && (
                    <i className="absolute -inset-2 animate-ping rounded-full bg-red-400/45" />
                  )}
                  <span
                    className={`grid size-full place-items-center rounded-full ${hue(s.status)}`}
                  >
                    <MapPin size={8} className="text-white" />
                  </span>
                </button>
              </Marker>
            ))}
            {selected && (
              <Popup
                longitude={selected.longitude}
                latitude={selected.latitude}
                anchor="bottom"
                offset={20}
                closeButton={false}
              >
                <div className="w-52 p-1">
                  <div className="flex justify-between">
                    <div>
                      <p className="display text-[13px] font-semibold">
                        {selected.id}
                      </p>
                      <p className="text-[10px] text-zinc-500">
                        {selected.name}
                      </p>
                    </div>
                    <button onClick={() => setSelected(null)}>
                      <X size={12} />
                    </button>
                  </div>
                  <div className="mt-3 grid grid-cols-2 divide-x divide-[var(--line)] border-y border-[var(--line)] py-2">
                    <div>
                      <p className="eyebrow">Temp</p>
                      <b
                        className={`display text-[18px] ${selected.status === "critical" ? "text-red-600" : ""}`}
                      >
                        {selected.temperature || "—"}°
                      </b>
                    </div>
                    <div className="pl-3">
                      <p className="eyebrow">Health</p>
                      <b className="display text-[18px]">
                        {selected.health || "—"}
                      </b>
                    </div>
                  </div>
                  <button
                    onClick={() => setInspect(selected)}
                    className="mt-3 text-[10px] font-bold text-violet-700"
                  >
                    Show more →
                  </button>
                </div>
              </Popup>
            )}
          </Map>
          <div className="absolute left-5 top-5 rounded-lg border border-white/70 bg-white/92 p-1 shadow-sm backdrop-blur">
            <div className="flex items-center gap-1">
              <Layers3 size={13} className="ml-2 text-violet-600" />
              {(
                [
                  ["all", "All stations"],
                  ["faulty", "Faulty"],
                ] as [Mode, string][]
              ).map(([m, l]) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`rounded-md px-2.5 py-2 text-[10px] font-bold ${mode === m ? "bg-zinc-900 text-white" : "text-zinc-600 hover:bg-zinc-100"}`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
          <div className="pointer-events-none absolute bottom-5 left-5 rounded-lg border border-[var(--line)] bg-white/95 p-3 shadow-sm">
            <p className="eyebrow mb-2">Station status</p>
            <div className="flex gap-3 text-[10px] font-bold">
              <span className="text-emerald-700">● Normal</span>
              <span className="text-amber-700">● Warning</span>
              <span className="text-red-700">● Fault</span>
            </div>
          </div>
        </div>
      </section>
      {inspect && (
        <SensorModal station={inspect} close={() => setInspect(null)} />
      )}
    </>
  );
}
