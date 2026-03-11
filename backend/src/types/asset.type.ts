import { ITelemetry } from "./telemetry.type.js";
import { IAlert } from "./alert.type.js";

export enum AssetStatus {
  ONLINE,
  OFFLINE,
}

export interface IAsset {
  id: string;
  macAddr: string;
  status: AssetStatus;
  ownerId: string;
  telemetry: ITelemetry[];
  alerts: IAlert[];
  createdAt: Date | string;
  updatedAt: Date | string;
}
