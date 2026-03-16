import {
  AlertTriangle,
  BatteryWarning,
  Cpu,
  Info,
  Activity,
  AlertCircle
} from "lucide-react";
import type {
  AlertSeverity,
  MetricType,
} from "../types/Alerts";

/**
 * Maps severity to Tailwind classes (Dark Theme Optimized)
 */
export const getAlertTheme = (severity: AlertSeverity) => {
  switch (severity) {
    case "CRITICAL":
      return "bg-red-500/10 text-red-400 border-red-500/20";
    case "ERROR":
      return "bg-orange-500/10 text-orange-400 border-orange-500/20";
    case "WARNING":
      return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
    case "NORMAL":
      return "bg-blue-500/10 text-blue-400 border-blue-500/20";
    default:
      return "bg-gray-500/10 text-gray-400 border-gray-500/20";
  }
};

/**
 * Returns the appropriate Lucide icon component for a metric
 */
export const getAlertIcon = (metric: MetricType) => {
  switch (metric) {
    case "CPU_TEMP":
      return AlertTriangle;
    case "CPU_USAGE":
      return Cpu;
    case "BATTERY":
      return BatteryWarning;
    case "MEM_USAGE":
      return Activity;
    default:
      return Info;
  }
};

/**
 * Returns a severity icon
 */
export const getSeverityIcon = (severity: AlertSeverity) => {
    switch (severity) {
      case "CRITICAL":
        return AlertCircle;
      case "ERROR":
        return AlertCircle;
      case "WARNING":
        return AlertTriangle;
      case "NORMAL":
        return Info;
      default:
        return Info;
    }
  };

/**
 * Cleans up underscores and title-cases the metric types
 */
export const formatAlertLabel = (metric: MetricType) => {
  return metric
    .replace(/_/g, " ")
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};
