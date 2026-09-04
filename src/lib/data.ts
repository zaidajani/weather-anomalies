export type Severity = "normal" | "warning" | "critical" | "offline";
export type RequestStatus = "new" | "accepted" | "in-progress" | "completed";
export type Station = { id:string; name:string; state:string; city:string; health:number; status:Severity; lastUpdate:string; temperature:number; expected:number; anomalies:number; latitude:number; longitude:number };
export type Anomaly = { id:string; stationId:string; sensor:string; severity:Severity; confidence:number; type:string; status:string; actual:number; expected:number; nearbyAverage:number };
export type MaintenanceRequest = { id:string; anomalyId:string; stationId:string; sensor:string; priority:"critical"|"high"|"medium"; diagnosis:string; confidence:number; status:RequestStatus; createdAt:string; technician?:string; notes?:string; calibrationPerformed?:boolean };

const baseStations: Station[] = [
  {id:"AWS-MH-042",name:"Pune Observatory",state:"Maharashtra",city:"Pune",health:58,status:"critical",lastUpdate:"1 min ago",temperature:43.8,expected:35.4,anomalies:1,latitude:18.5204,longitude:73.8567},
  {id:"AWS-MH-038",name:"Lonavala Ridge",state:"Maharashtra",city:"Lonavala",health:96,status:"normal",lastUpdate:"1 min ago",temperature:35.0,expected:35.2,anomalies:0,latitude:18.75,longitude:73.41},
  {id:"AWS-MH-045",name:"Satara Field",state:"Maharashtra",city:"Satara",health:93,status:"normal",lastUpdate:"2 min ago",temperature:35.3,expected:35.0,anomalies:0,latitude:17.68,longitude:73.99},
  {id:"AWS-DL-014",name:"Ridge Station",state:"Delhi",city:"New Delhi",health:82,status:"warning",lastUpdate:"4 min ago",temperature:39.1,expected:38.8,anomalies:2,latitude:28.61,longitude:77.21},
  {id:"AWS-KA-021",name:"Bengaluru South",state:"Karnataka",city:"Bengaluru",health:97,status:"normal",lastUpdate:"1 min ago",temperature:28.2,expected:28.1,anomalies:0,latitude:12.97,longitude:77.59},
  {id:"AWS-AS-007",name:"Guwahati East",state:"Assam",city:"Guwahati",health:0,status:"offline",lastUpdate:"42 min ago",temperature:0,expected:30.4,anomalies:0,latitude:26.14,longitude:91.74}
];

const networkLocations = [
  ["RJ","Rajasthan","Jaipur",26.9124,75.7873,35], ["GJ","Gujarat","Ahmedabad",23.0225,72.5714,34], ["MP","Madhya Pradesh","Bhopal",23.2599,77.4126,33], ["UP","Uttar Pradesh","Lucknow",26.8467,80.9462,34],
  ["BR","Bihar","Patna",25.5941,85.1376,32], ["WB","West Bengal","Kolkata",22.5726,88.3639,31], ["OD","Odisha","Bhubaneswar",20.2961,85.8245,32], ["TG","Telangana","Hyderabad",17.385,78.4867,33],
  ["AP","Andhra Pradesh","Visakhapatnam",17.6868,83.2185,30], ["TN","Tamil Nadu","Chennai",13.0827,80.2707,30], ["KL","Kerala","Kochi",9.9312,76.2673,29], ["GA","Goa","Panaji",15.4909,73.8278,30],
  ["KA","Karnataka","Mysuru",12.2958,76.6394,28], ["MH","Maharashtra","Nagpur",21.1458,79.0882,35], ["CG","Chhattisgarh","Raipur",21.2514,81.6296,34], ["JH","Jharkhand","Ranchi",23.3441,85.3096,31],
  ["UK","Uttarakhand","Dehradun",30.3165,78.0322,25], ["HP","Himachal Pradesh","Shimla",31.1048,77.1734,22], ["PB","Punjab","Ludhiana",30.901,75.8573,32], ["HR","Haryana","Hisar",29.1492,75.7217,34],
  ["AS","Assam","Dibrugarh",27.4728,94.912,29], ["MN","Manipur","Imphal",24.817,93.9368,28], ["TR","Tripura","Agartala",23.8315,91.2868,30], ["SK","Sikkim","Gangtok",27.3389,88.6065,19],
] as const;

function buildNetworkStations(): Station[] {
  return Array.from({ length: 94 }, (_, index) => {
    const location = networkLocations[index % networkLocations.length];
    const [code, state, city, latitude, longitude, baseline] = location;
    const critical = index === 28 || index === 67;
    const warning = index % 17 === 5;
    const offline = index === 81;
    const status: Severity = critical ? "critical" : offline ? "offline" : warning ? "warning" : "normal";
    const expected = baseline + ((index % 5) - 2) * 0.35;
    return {
      id: `AWS-${code}-${String(index + 101).padStart(3, "0")}`,
      name: `${city} ${index % 2 ? "Regional" : "Automatic"} AWS`,
      state,
      city,
      health: offline ? 0 : critical ? 54 : warning ? 78 : 90 + (index % 9),
      status,
      lastUpdate: offline ? "37 min ago" : `${1 + (index % 6)} min ago`,
      temperature: offline ? 0 : Number((expected + (critical ? 6.8 : warning ? 1.5 : ((index % 3) - 1) * 0.2)).toFixed(1)),
      expected: Number(expected.toFixed(1)),
      anomalies: critical ? 1 : warning ? 1 : 0,
      latitude: Number((latitude + ((index % 4) - 1.5) * 0.23).toFixed(4)),
      longitude: Number((longitude + ((Math.floor(index / 4) % 4) - 1.5) * 0.24).toFixed(4)),
    };
  });
}

export const stations: Station[] = [...baseStations, ...buildNetworkStations()];
export const anomalies: Anomaly[] = [{id:"ANM-2026-0842",stationId:"AWS-MH-042",sensor:"Temperature",severity:"critical",confidence:96,type:"Calibration Drift",status:"New",actual:43.8,expected:35.4,nearbyAverage:35.1}];
export const trend = [{time:"09:00",actual:34.9,expected:35.2},{time:"10:00",actual:35.5,expected:35.3},{time:"11:00",actual:38.7,expected:35.4},{time:"12:00",actual:41.6,expected:35.4},{time:"13:00",actual:43.8,expected:35.4}];
