import Link from "next/link";
import { Phone, Mail, MessageCircle, MapPin, ChevronRight } from "lucide-react";
import { getMessages } from "@/lib/getMessages";
import { getLocale } from "@/lib/getLocale";

export default async function Footer() {
  const locale = await getLocale();
  const m = getMessages(locale).footer;

  return (
    <footer className="mt-16 bg-slate-950 text-slate-300">
      {/* Top CTA */}
      <div className="border-b border-slate-800">
        <div className="mx-auto max-w-6xl px-6 py-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-400">{m.cta.text}</p>

          <div className="flex gap-3">
            <Link
              href="/booking"
              className="inline-flex items-center justify-center rounded-lg bg-cyan-600 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
            >
              {m.cta.book}
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>

            <a
              href={`tel:${process.env.PHONE_NUMBER?.replace(/\s/g, "")}`}
              className="inline-flex items-center justify-center rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-600"
            >
              {m.cta.call}
            </a>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <h3 className="text-base font-semibold text-white">
              {m.brand.name}
            </h3>
            <p className="mt-3 text-sm leading-6 text-slate-400">
              {m.brand.description}
            </p>
          </div>

          {/* Navigation */}
          <nav aria-label="Footer Navigation">
            <h3 className="text-base font-semibold text-white">
              {m.nav.title}
            </h3>

            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <Link href="/" className="hover:text-white rounded">
                  {m.nav.links.home}
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-white rounded">
                  {m.nav.links.services}
                </Link>
              </li>
              <li>
                <Link href="/booking" className="hover:text-white rounded">
                  {m.nav.links.booking}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white rounded">
                  {m.nav.links.contact}
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/bookings"
                  className="hover:text-white rounded"
                >
                  {m.nav.links.admin}
                </Link>
              </li>
            </ul>
          </nav>

          {/* Areas */}
          <div>
            <h3 className="text-base font-semibold text-white">
              {m.areas.title}
            </h3>

            <ul className="mt-4 grid grid-cols-2 gap-2 text-sm text-slate-400">
              {m.areas.list.map((area) => (
                <li key={area}>{area}</li>
              ))}
            </ul>

            <p className="mt-3 text-xs text-slate-500">{m.areas.note}</p>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-base font-semibold text-white">
              {m.contact.title}
            </h3>

            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-cyan-400" />
                <a
                  href={`tel:${m.contact.tel}`}
                  className="hover:text-white rounded"
                >
                  {m.contact.tel}
                </a>
              </li>

              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-cyan-400" />
                <a
                  href={`mailto:${m.contact.email}`}
                  className="hover:text-white rounded"
                >
                  {m.contact.email}
                </a>
              </li>

              <li className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4 text-cyan-400" />
                <a
                  href={m.contact.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white rounded"
                >
                  WhatsApp
                </a>
              </li>

              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-cyan-400" />
                <span>{m.contact.location}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal */}
        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-slate-800 pt-6 text-xs text-slate-500 sm:flex-row">
          <p>
            © {new Date().getFullYear()} {m.brand.name}. {m.legal.rights}
          </p>

          <div className="flex gap-4">
            <span>{m.legal.hours}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
