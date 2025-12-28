import { randomBytes, createHash } from "crypto";

export function generateApiKey() {
  return `grd_live_${randomBytes(32).toString("hex")}`;
}