import { headers } from "next/headers";

export async function getLocale(): Promise<"en" | "pt"> {
  const headersList = await headers();
  const host = headersList.get("host") || "";

  // ✅ DEV support (localhost / .local)
  if (
    process.env.NODE_ENV === "development" &&
    (host.startsWith("lislock.") || host.includes("lislock"))
  ) {
    return "pt";
  }

  // ✅ PRODUCTION rule
  if (host.endsWith(".pt")) return "pt";

  return "en";
}
