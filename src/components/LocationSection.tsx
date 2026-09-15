import { shop } from "@/lib/shop";
import { ClockIcon, MailIcon, PhoneIcon, PinIcon } from "./Icons";

export function LocationSection() {
  return (
    <section className="py-10">
      <div className="grid gap-8 lg:grid-cols-12 lg:items-start">
        <div className="lg:col-span-5">
          <p className="eyebrow">Visit the café</p>
          <h2 className="mt-3 max-w-[18ch] text-3xl font-semibold text-balance sm:text-4xl">
            Corner shop on Rizal Avenue.
          </h2>

          <dl className="mt-6 space-y-5 text-sm">
            <div className="flex gap-3">
              <PinIcon className="mt-0.5 h-4 w-4 shrink-0 text-clay" />
              <div>
                <dt className="text-xs uppercase tracking-[0.15em] text-foreground/45">Address</dt>
                <dd className="mt-1">
                  <a
                    href={shop.mapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="underline decoration-clay/40 underline-offset-4 transition-colors hover:text-clay"
                  >
                    {shop.addressLine}
                  </a>
                </dd>
              </div>
            </div>

            <div className="flex gap-3">
              <ClockIcon className="mt-0.5 h-4 w-4 shrink-0 text-clay" />
              <div>
                <dt className="text-xs uppercase tracking-[0.15em] text-foreground/45">Hours</dt>
                {shop.hours.map((h) => (
                  <dd key={h.days} className="mt-1">
                    <span className="text-foreground/50">{h.days}</span> · {h.time}
                  </dd>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <PhoneIcon className="mt-0.5 h-4 w-4 shrink-0 text-clay" />
              <div>
                <dt className="text-xs uppercase tracking-[0.15em] text-foreground/45">Phone</dt>
                <dd className="mt-1">
                  <a href={shop.phoneHref} className="transition-colors hover:text-clay">
                    {shop.phoneDisplay}
                  </a>
                </dd>
              </div>
            </div>

            <div className="flex gap-3">
              <MailIcon className="mt-0.5 h-4 w-4 shrink-0 text-clay" />
              <div>
                <dt className="text-xs uppercase tracking-[0.15em] text-foreground/45">Email</dt>
                <dd className="mt-1">
                  <a
                    href={`mailto:${shop.email}`}
                    className="transition-colors hover:text-clay"
                  >
                    {shop.email}
                  </a>
                </dd>
              </div>
            </div>
          </dl>

          <a
            href={shop.mapsUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-7 inline-block rounded-[min(1vw,10px)] bg-clay px-6 py-3 text-sm font-medium text-paper transition-colors hover:bg-clay/90"
          >
            Get directions
          </a>
        </div>

        <div className="lg:col-span-7">
          <div className="overflow-hidden rounded-[min(1.4vw,16px)] ring-1 ring-foreground/10">
            <iframe
              title={`Map to ${shop.name}`}
              src="https://www.openstreetmap.org/export/embed.html?bbox=121.045%2C13.748%2C121.075%2C13.766&layer=mapnik&marker=13.757%2C121.058"
              loading="lazy"
              className="h-[320px] w-full border-0 sm:h-[420px]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
