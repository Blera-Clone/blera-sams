export interface Telemetry {
  id: string;
  assetId: string;
  cpuName: string;
  cpuTotalUsagePercent: number;
  cpuPerCoreUsage: number[];
  cpuFrequency: number;
  cpuTemperature: number | null;
  memoryTotal: number;
  memoryAvailable: number;
  memoryUsed: number;
  memoryUsagePercent: number;
  batteryPercent: number | null;
  batteryPowerPlugged: boolean;
  batterySecondsLeft: number | null;
  timestamp: string; // ISO String from backend
}

export type Stats = {
  totalAssets: number;
  onlineAssets: number;
  offlineAssets: number;
  activeAlerts: number;
};
