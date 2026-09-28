import { Link } from "@tanstack/react-router";
import { shop } from "@/lib/shop";
import { FacebookIcon, InstagramIcon, MailIcon, PhoneIcon, PinIcon } from "./Icons";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-foreground/10 bg-paper/60">
      <div className="mx-auto max-w-6xl px-5 py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <span className="font-serif text-lg font-semibold">{shop.name}</span>
            <p className="mt-2 max-w-[34ch] text-sm text-foreground/55">
              {shop.tagline} Roasted in-house each week and served to your table.
            </p>
            <div className="mt-4 flex gap-2">
              <a
                href={shop.facebook}
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="grid h-9 w-9 place-items-center rounded-[min(1vw,10px)] ring-1 ring-foreground/10 transition-colors hover:bg-foreground/5"
              >
                <FacebookIcon className="h-4 w-4" />
              </a>
              <a
                href={shop.instagram}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="grid h-9 w-9 place-items-center rounded-[min(1vw,10px)] ring-1 ring-foreground/10 transition-colors hover:bg-foreground/5"
              >
                <InstagramIcon className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-foreground/45">Menu</p>
            <ul className="mt-3 space-y-2 text-sm text-foreground/70">
              <li>
                <Link to="/menu" className="transition-colors hover:text-foreground">
                  Full menu
                </Link>
              </li>
              <li>
                <Link to="/about" className="transition-colors hover:text-foreground">
                  Our story
                </Link>
              </li>
              <li>
                <Link to="/reviews" className="transition-colors hover:text-foreground">
                  Reviews
                </Link>
              </li>
              <li>
                <Link to="/contact" className="transition-colors hover:text-foreground">
                  Visit us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-foreground/45">Contact</p>
            <ul className="mt-3 space-y-2 text-sm text-foreground/70">
              <li>
                <a
                  href={shop.phoneHref}
                  className="inline-flex items-center gap-2 transition-colors hover:text-foreground"
                >
                  <PhoneIcon className="h-4 w-4 shrink-0 text-clay" />
                  {shop.phoneDisplay}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${shop.email}`}
                  className="inline-flex items-center gap-2 transition-colors hover:text-foreground"
                >
                  <MailIcon className="h-4 w-4 shrink-0 text-clay" />
                  {shop.email}
                </a>
              </li>
              <li>
                <a
                  href={shop.mapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-start gap-2 transition-colors hover:text-foreground"
                >
                  <PinIcon className="mt-0.5 h-4 w-4 shrink-0 text-clay" />
                  <span>{shop.addressLine}</span>
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-foreground/45">Hours</p>
            <ul className="mt-3 space-y-2 text-sm text-foreground/70">
              {shop.hours.map((h) => (
                <li key={h.days}>
                  <span className="block text-foreground/50">{h.days}</span>
                  {h.time}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-foreground/40">
            © {new Date().getFullYear()} {shop.name} · Concept site for an independent specialty
            café.
          </p>
          <Link to="/auth" className="text-xs text-foreground/40 hover:text-foreground">
            Staff sign in
          </Link>
        </div>
      </div>
    </footer>
  );
}
