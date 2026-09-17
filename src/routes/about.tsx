import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { shop } from "@/lib/shop";
import cafeInterior from "@/assets/cafe-interior.jpg";
import espressoPour from "@/assets/espresso-pour.jpg";
import croissants from "@/assets/croissants.jpg";
import { ArrowRightIcon } from "@/components/Icons";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "Our Story — Kape & Klase, Batangas City" },
      {
        name: "description",
        content:
          "How Kape & Klase started: one weekly roast, beans from Lipa and Amadeo, food cooked to order and a room built for slow mornings.",
      },
      { property: "og:title", content: "Our Story — Kape & Klase" },
      {
        property: "og:description",
        content:
          "One weekly roast, beans from Lipa and Amadeo, and a room built for slow mornings in Batangas City.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <SiteLayout>
      <section className="pt-10 pb-10">
        <p className="eyebrow">Our story</p>
        <h1 className="mt-3 max-w-[18ch] text-3xl font-semibold text-balance sm:text-5xl">
          Two tables, one roast, and a room that stays quiet.
        </h1>
      </section>

      <section className="pb-12">
        <img
          src={cafeInterior}
          alt="Guests seated at wooden tables inside the café in afternoon light"
          width={1280}
          height={960}
          className="aspect-16/9 w-full rounded-[min(1.4vw,16px)] object-cover"
        />
      </section>

      <section className="grid gap-10 pb-14 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <h2 className="text-2xl font-semibold text-balance sm:text-3xl">
            We started with a secondhand roaster.
          </h2>
          <p className="mt-4 max-w-[58ch] text-[15px] leading-relaxed text-pretty text-foreground/70">
            {shop.name} opened in 2019 with two tables, a borrowed grinder and a 3kg roaster we
            kept in the back room. We still roast in the same corner every Tuesday — beans bought
            green from smallholder farms in Lipa and Amadeo, cupped on Wednesday, served until the
            batch runs out.
          </p>
          <p className="mt-4 max-w-[58ch] text-[15px] leading-relaxed text-pretty text-foreground/70">
            Nothing on the bar is automated. Every shot is dialled in the morning and adjusted
            through the day as the weather changes. If a coffee isn't right, we'll make it again —
            just tell whoever brings it to your table.
          </p>
        </div>
        <div className="lg:col-span-5">
          <img
            src={espressoPour}
            alt="Barista pulling an espresso shot"
            loading="lazy"
            width={816}
            height={816}
            className="aspect-square w-full rounded-[min(1.4vw,16px)] object-cover"
          />
        </div>
      </section>

      <section className="grid gap-10 pb-14 lg:grid-cols-12 lg:items-center">
        <div className="order-2 lg:order-1 lg:col-span-5">
          <img
            src={croissants}
            alt="Croissants baked that morning"
            loading="lazy"
            width={816}
            height={816}
            className="aspect-square w-full rounded-[min(1.4vw,16px)] object-cover"
          />
        </div>
        <div className="order-1 lg:order-2 lg:col-span-7">
          <h2 className="text-2xl font-semibold text-balance sm:text-3xl">
            The kitchen keeps the same hours as the bar.
          </h2>
          <p className="mt-4 max-w-[58ch] text-[15px] leading-relaxed text-pretty text-foreground/70">
            Pastries are laminated the night before and baked in small trays through the morning.
            Rice bowls are cooked to order — jasmine rice, chicken and beef from a supplier two
            towns over, sauces made in-house each week. When something sells out, it stays off the
            board until the next bake.
          </p>
          <p className="mt-4 max-w-[58ch] text-[15px] leading-relaxed text-pretty text-foreground/70">
            Students, freelancers and families share the room, so we keep the music low, leave the
            power outlets free, and let people sit as long as they like. Ordering from your table
            came out of that: nobody should have to queue twice to get a second cup.
          </p>
          <Link
            to="/menu"
            className="mt-6 inline-flex items-center gap-1.5 rounded-[min(1vw,10px)] bg-clay px-6 py-3 text-sm font-medium text-paper transition-colors hover:bg-clay/90"
          >
            See the menu
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </SiteLayout>
  );
}
