import type { Alert } from "./Alerts";
import type { Telemetry } from "./Telemetry";

export type Status = "ONLINE" | "OFFLINE";

export interface Asset {
  id: string;
  name: string;
  macAddr: string;
  status: Status;
  createdAt: string; // Prisma DateTime is returned as string in JSON
  updatedAt: string;
  ownerId: string;
  alerts?: Alert[];
  telemetry?: Telemetry[];
}
