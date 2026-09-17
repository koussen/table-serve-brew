import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { ReviewSection } from "@/components/ReviewSection";

export const Route = createFileRoute("/reviews")({
  head: () => ({
    meta: [
      { title: "Reviews — Kape & Klase, Batangas City" },
      {
        name: "description",
        content:
          "Rated 4.8 out of 5 across 128 reviews. Read what guests say about the coffee, food and table ordering at Kape & Klase.",
      },
      { property: "og:title", content: "Reviews — Kape & Klase" },
      {
        property: "og:description",
        content: "Rated 4.8 out of 5 across 128 guest reviews in Batangas City.",
      },
    ],
  }),
  component: ReviewsPage,
});

function ReviewsPage() {
  return (
    <SiteLayout>
      <section className="pt-10 pb-2">
        <p className="eyebrow">Reviews</p>
        <h1 className="mt-3 max-w-[20ch] text-3xl font-semibold text-balance sm:text-5xl">
          What guests say after they sit down.
        </h1>
      </section>
      <ReviewSection />
    </SiteLayout>
  );
}
