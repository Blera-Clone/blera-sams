export type AlertSeverity = "NORMAL" | "WARNING" | "CRITICAL" | "ERROR";

export type MetricType = "CPU_USAGE" | "CPU_TEMP" | "MEM_USAGE" | "BATTERY";

export interface Alert {
  id: string;
  assetId: string;
  type: AlertSeverity;
  metric: MetricType;
  message: string;
  isResolved: boolean;
  eventTimestamp: string;
  createdAt: string;
  updatedAt: string;
}

export interface GroupedAlertAsset {
  assetId: string;
  metrics: {
    cpu?: number;
    ram?: number;
    temp?: number;
    battery?: number;
  };
  activeAlerts: Alert[];
  highestSeverity: AlertSeverity;
}
