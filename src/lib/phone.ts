// src/lib/phone.ts
export function toE164Irish(input: string): string | null {
  if (!input) return null;
  const p = input.trim().replace(/[^\d+]/g, ""); // keep digits and leading +

  // already E.164 and plausible
  if (p.startsWith("+") && /^\+\d{7,15}$/.test(p)) return p;

  // leading 0 → replace with +353
  if (/^0\d{7,10}$/.test(p)) return `+353${p.slice(1)}`;

  // bare 8xx… mobiles typed without 0
  if (/^8\d{7,9}$/.test(p)) return `+353${p}`;

  return null; // let caller handle invalids
}
