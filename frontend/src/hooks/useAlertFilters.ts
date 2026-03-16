import type { Alert, AlertSeverity } from "../types/Alerts";

export const useAlertFilters = (alerts: Alert[]) => {
  const activeAlerts = alerts.filter((a) => !a.isResolved);
  const resolvedAlerts = alerts.filter((a) => a.isResolved);

  const sortBySeverity = (list: Alert[]) => {
    const priority: Record<AlertSeverity, number> = { CRITICAL: 0, ERROR: 1, WARNING: 2, NORMAL: 3 };
    return [...list].sort(
      (a, b) => priority[a.type] - priority[b.type],
    );
  };

  return { activeAlerts, resolvedAlerts, sortBySeverity };
};
