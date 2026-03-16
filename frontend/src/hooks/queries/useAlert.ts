import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { SERVER_URL } from "../../config/config";
import { useAuthStore } from "../../store/useAuthStore";

export const useAlerts = (page: number, viewMode: 'ACTIVE' | 'RESOLVED',search: string, severity: string, timeFrame: string, limit: number = 10) => {
  const token = useAuthStore((state) => state.token);

  return useQuery({
    queryKey: ["alerts", viewMode, page, search, severity, timeFrame, limit],
    enabled: !!token,
    queryFn: async () => {
      const response = await fetch(`${SERVER_URL}/api/alert?page=${page}&limit=${limit}&status=${viewMode}&search=${encodeURIComponent(search)}&severity=${severity}&timeFrame=${timeFrame}`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch alerts");
      }

      return response.json();
    },
    select: (result) => {
       const formattedAlerts = result.data.map((rawAlert: any) => {
        let derivedCategory: "THERMAL" | "CPU" | "INFO" = "INFO";

        if (rawAlert.metric.includes("TEMP")) derivedCategory = "THERMAL";
        else if (rawAlert.metric.includes("USAGE"))
          derivedCategory = "CPU";

        return {
          id: rawAlert.id,
          assetId: rawAlert.assetId,
          severity: rawAlert.type, 
          type: rawAlert.metric,
          category: derivedCategory,
          message: rawAlert.message,
          isResolved: rawAlert.isResolved,
          createdAt: rawAlert.createdAt,
          updatedAt: rawAlert.updatedAt,
        };
      });

      return {
        alerts: formattedAlerts,
        totalPages: result.pagination?.totalPages || 1,
        counts: result.counts || { active: 0, resolved: 0 }
      };
    },
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60, // 1 min
    refetchOnWindowFocus: true,
  });
};
