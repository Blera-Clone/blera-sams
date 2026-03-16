import { create } from "zustand";
import { type Asset } from "../types/Asset";
import type { Alert } from "../types/Alerts";

interface AssetStore {
  assets: Asset[];
  // Upsert logic that specifically merges the alert array
  upsertAlertingAssets: (incoming: Asset[]) => void;
  // Handle a single live alert coming in via WebSocket
  addLiveAlert: (alert: Alert) => void;
  // Handle alert resolution
  resolveAlert: (alertId: string) => void;
}

export const useAssetStore = create<AssetStore>((set) => ({
  assets: [],

  upsertAlertingAssets: (incoming) =>
    set((state) => {
      const assetMap = new Map(state.assets.map((a: Asset) => [a.id, a]));

      incoming.forEach((asset: Asset) => {
        const existing = assetMap.get(asset.id);
        // Ensure we don't lose existing alerts when merging new data
        const mergedAlerts = [
          ...(existing?.alerts || []),
          ...(asset.alerts || []),
        ];
        // De-duplicate alerts by ID
        const uniqueAlerts = Array.from(
          new Map(mergedAlerts.map((a) => [a.id, a])).values(),
        );

        assetMap.set(asset.id, {
          ...existing,
          ...asset,
          alerts: uniqueAlerts,
        });
      });

      return { assets: Array.from(assetMap.values()) };
    }),

  addLiveAlert: (newAlert: Alert) =>
    set((state) => ({
      assets: state.assets.map((asset: Asset) => {
        if (asset.id === newAlert.assetId) {
          // Check if alert already exists to prevent duplicates
          const exists = asset.alerts?.some((a: Alert) => a.id === newAlert.id);
          if (exists) return asset;

          return {
            ...asset,
            alerts: [...(asset.alerts || []), newAlert],
          };
        }
        return asset;
      }),
    })),

  resolveAlert: (alertId: string) =>
    set((state) => ({
      assets: state.assets
        .map((asset: Asset) => ({
          ...asset,
          alerts: asset.alerts?.filter((a: Alert) => a.id !== alertId),
        }))
        .filter(
          (asset: Asset) =>
            (asset.alerts?.length ?? 0) > 0 || asset.status === "OFFLINE",
        ),
    })),
}));
