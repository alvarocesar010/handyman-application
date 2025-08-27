import twilio from "twilio";

const sid = process.env.TWILIO_ACCOUNT_SID!;
const token = process.env.TWILIO_AUTH_TOKEN!;
const SMS_FROM = process.env.TWILIO_SMS_FROM || "";
const WA_FROM = process.env.TWILIO_WA_FROM || "";

if (!sid || !token) {
  // Don’t crash imports in dev if not configured
  // console.warn("Twilio not configured");
}
const client = sid && token ? twilio(sid, token) : null;

/** Convert Irish/local inputs to E.164. Very light/defensive. */
export function toE164Irish(input: string): string | null {
  const p = input.trim().replace(/[\s()-]/g, "");
  if (!p) return null;
  // Already E.164
  if (p.startsWith("+")) return p;
  // 08x mobile → +3538x...
  if (/^0\d{8,10}$/.test(p)) {
    // drop leading 0, prefix +353
    return `+353${p.slice(1)}`;
  }
  // last resort: return as-is if looks numeric
  if (/^\d{6,15}$/.test(p)) return `+${p}`;
  return null;
}

type BookingSummary = {
  name: string;
  phone: string;
  service: string;
  date: string;
  eircode: string;
};

export async function sendBookingNotifications(b: BookingSummary) {
  if (!client) return;

  const to = toE164Irish(b.phone);
  if (!to) return;

  const smsBody =
    `Hi ${b.name.split(" ")[0]}, we received your booking for ${labelise(
      b.service
    )} on ${b.date}. ` +
    `We’ll confirm shortly. If anything changes, reply to this message. — Dublin Handyman`;

  const waBody =
    `✅ *Booking received*\n\n` +
    `*Name:* ${b.name}\n` +
    `*Service:* ${labelise(b.service)}\n` +
    `*Date:* ${b.date}\n` +
    `*Eircode:* ${b.eircode}\n\n` +
    `We’ll confirm availability shortly. Thanks!\n_Dublin Handyman_`;

  const tasks: Promise<unknown>[] = [];

  if (SMS_FROM) {
    tasks.push(
      client.messages
        .create({ from: SMS_FROM, to, body: smsBody })
        .catch((e) => console.error("SMS error:", e?.message || e))
    );
  }

  if (WA_FROM) {
    tasks.push(
      client.messages
        .create({ from: WA_FROM, to: `whatsapp:${to}`, body: waBody })
        .catch((e) => console.error("WA error:", e?.message || e))
    );
  }

  // Don’t let errors bubble; we log and continue
  await Promise.allSettled(tasks);
}

function labelise(slug: string) {
  return slug.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}
