# WeatherAnomalies

Frontend prototype for SIH PS 26073: AI/ML-based anomaly detection for Automatic Weather Stations.

## Current prototype slice

- Operator and Maintenance portals with a shared desktop command-center shell.
- Deterministic mock data for the AWS-MH-042 calibration-drift scenario.
- Local persisted workflow: investigate → create request → accept → start work → complete calibration → resolve.
- Recharts-based validation chart and a prototype India network map surface.

## Run locally

```bash
npm run dev
```

Open `http://localhost:3000`.

Use the reset control in the left sidebar to replay the demo.
