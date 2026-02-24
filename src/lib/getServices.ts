import { headers } from "next/headers";
import { SERVICES_EN } from "./services_en";
import { SERVICES_PT } from "./services_pt";
import { Service } from "@/types/service"; // se você tiver

export async function getServices(): Promise<Service[]> {
  const headersList = await headers();
  const host = headersList.get("host") ?? "";

  if (host.includes("lislock")) {
    return SERVICES_PT;
  }

  return SERVICES_EN;
}
