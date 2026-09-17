import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { LocationSection } from "@/components/LocationSection";
import { shop } from "@/lib/shop";
import { FacebookIcon, InstagramIcon, MailIcon, PhoneIcon } from "@/components/Icons";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Visit & Contact — Kape & Klase, Batangas City" },
      {
        name: "description",
        content:
          "Find Kape & Klase on Rizal Avenue, Batangas City. Opening hours, phone, email, socials and directions.",
      },
      { property: "og:title", content: "Visit & Contact — Kape & Klase" },
      {
        property: "og:description",
        content: "Opening hours, phone, email, socials and directions to the café.",
      },
    ],
  }),
  component: ContactPage,
});

const channels = [
  {
    label: "Facebook",
    value: "facebook.com/kapeklase",
    href: shop.facebook,
    Icon: FacebookIcon,
    external: true,
  },
  {
    label: "Instagram",
    value: "@kapeklase",
    href: shop.instagram,
    Icon: InstagramIcon,
    external: true,
  },
  { label: "Email", value: shop.email, href: `mailto:${shop.email}`, Icon: MailIcon },
  { label: "Phone", value: shop.phoneDisplay, href: shop.phoneHref, Icon: PhoneIcon },
];

function ContactPage() {
  return (
    <SiteLayout>
      <section className="pt-10 pb-8">
        <p className="eyebrow">Contact</p>
        <h1 className="mt-3 max-w-[20ch] text-3xl font-semibold text-balance sm:text-5xl">
          Come by, or send us a message.
        </h1>
      </section>

      <section className="pb-4">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {channels.map(({ label, value, href, Icon, external }) => (
            <a
              key={label}
              href={href}
              {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
              className="rounded-[min(1vw,14px)] bg-paper p-5 ring-1 ring-foreground/5 transition-transform duration-300 hover:-translate-y-1"
            >
              <Icon className="h-5 w-5 text-clay" />
              <p className="mt-3 text-xs uppercase tracking-[0.15em] text-foreground/45">
                {label}
              </p>
              <p className="mt-1 truncate text-sm font-medium">{value}</p>
            </a>
          ))}
        </div>
      </section>

      <LocationSection />
    </SiteLayout>
  );
}
