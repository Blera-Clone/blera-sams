import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SERVER_URL } from "../../config/config";
import { useAuthStore } from "../../store/useAuthStore";
import { toast } from "sonner";

interface AssetDraft {
  name: string;
  mac: string;
}

export const useAddAssetMutation = () => {
  const token = useAuthStore((state) => state.token);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (assets: AssetDraft[]) => {
      const res = await fetch(`${SERVER_URL}/api/asset/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ devices: assets }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to add assets");
      }

      return data;
    },
    onSuccess: () => {
      toast.success("Assets registered successfully!");
      localStorage.removeItem("blera_assets_draft");
      queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
    },
    onError: (error: Error) => {
      toast.error("Failed to add assets", {
        description: error.message,
      });
    },
  });
};
