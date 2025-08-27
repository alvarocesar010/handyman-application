import Image from "next/image";
import Link from "next/link";

const HeroSection = () => {
  return (
    <section
      aria-labelledby="hero-title"
      className="bg-slate-100/80 border border-slate-200 rounded-xl p-6 md:p-8"
    >
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-6 md:grid-cols-12">
        {/* Text */}
        <div className="md:col-span-6 space-y-4">
          <h1
            id="hero-title"
            className="text-3xl md:text-4xl font-extrabold tracking-tight text-indigo-950"
          >
            Handyman Services in Dublin – Repairs & Maintenance
          </h1>

          <p className="text-slate-800 leading-relaxed">
            From small fixes to urgent repairs, I can help. Choose the service
            that suits you best below and book a convenient date.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              href="/booking" // set this to your booking section id or /booking page
              className="inline-flex h-11 items-center justify-center rounded-lg bg-cyan-700 px-5 text-white font-medium shadow hover:bg-cyan-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 focus-visible:ring-offset-2"
            >
              Book a Repair
            </Link>

            <a
              href={`tel:${process.env.NEXT_PUBLIC_PHONE_NUMBER?.replace(/\s/g, "")}`}
              className="inline-flex h-11 items-center justify-center rounded-lg bg-slate-900 px-5 text-white font-medium shadow hover:bg-black focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-700 focus-visible:ring-offset-2"
            >
              Call Now
            </a>
          </div>
        </div>

        {/* Image */}
        <div className="md:col-span-6 flex md:justify-end gap-8">
          {/* Quick trust badges (optional, boosts conversions) */}
          <ul className="mt-3 flex flex-col gap-4 md:gap-x-6 gap-y-2 text-sm text-slate-700 justify-center">
            <li>✔ Same-day callouts when available</li>
            <li>✔ Upfront pricing</li>
            <li>✔ Fully insured</li>
          </ul>
          <div className="rounded-xl bg-white p-2 shadow-sm ring-1 ring-slate-200">
            <Image
              className="rounded-lg object-contain"
              alt="Handyman service in Dublin"
              src="/images/handyman.webp"
              width={220}
              height={220}
              priority // good for LCP in the hero
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
