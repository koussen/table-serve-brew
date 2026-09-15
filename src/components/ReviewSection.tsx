import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ratingSummary, seedReviews, type Review } from "@/data/reviews";
import { StarIcon } from "./Icons";

const STORAGE_KEY = "kk.reviews";

function Stars({ rating, className = "h-4 w-4" }: { rating: number; className?: string }) {
  return (
    <span className="flex gap-0.5 text-clay" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <StarIcon key={n} className={className} filled={n <= rating} />
      ))}
    </span>
  );
}

export function ReviewSection() {
  const [reviews, setReviews] = useState<Review[]>(seedReviews);
  const [formOpen, setFormOpen] = useState(false);
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [body, setBody] = useState("");

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setReviews([...(JSON.parse(raw) as Review[]), ...seedReviews]);
    } catch {
      /* ignore */
    }
  }, []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    const trimmedBody = body.trim();
    if (!trimmedName || !trimmedBody) {
      toast.error("Please add your name and a short review.");
      return;
    }
    const review: Review = {
      id: `local-${Date.now()}`,
      name: trimmedName.slice(0, 40),
      rating,
      body: trimmedBody.slice(0, 500),
      date: new Date().toISOString().slice(0, 10),
    };
    const next = [review, ...reviews];
    setReviews(next);
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(next.filter((r) => r.id.startsWith("local-"))),
      );
    } catch {
      /* ignore */
    }
    setName("");
    setBody("");
    setRating(5);
    setFormOpen(false);
    toast.success("Thanks — your review is posted.");
  };

  return (
    <section className="py-10">
      <div className="grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <p className="eyebrow">What people say</p>
          <div className="mt-4 flex items-baseline gap-3">
            <span className="font-serif text-5xl font-semibold">{ratingSummary.average}</span>
            <span className="text-sm text-foreground/50">/ 5</span>
          </div>
          <div className="mt-2">
            <Stars rating={5} className="h-5 w-5" />
          </div>
          <p className="mt-2 text-sm text-foreground/55">
            Based on {ratingSummary.count} reviews
          </p>

          <ul className="mt-6 space-y-2">
            {ratingSummary.distribution.map((d) => (
              <li key={d.stars} className="flex items-center gap-3 text-xs text-foreground/60">
                <span className="w-10 shrink-0">{d.stars} star</span>
                <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-foreground/10">
                  <span
                    className="block h-full rounded-full bg-clay"
                    style={{ width: `${d.percent}%` }}
                  />
                </span>
                <span className="w-9 shrink-0 text-right">{d.percent}%</span>
              </li>
            ))}
          </ul>

          <button
            type="button"
            onClick={() => setFormOpen((v) => !v)}
            className="mt-6 rounded-[min(1vw,10px)] bg-espresso px-5 py-3 text-sm font-medium text-paper transition-colors hover:bg-espresso/90"
          >
            {formOpen ? "Close form" : "Leave a review"}
          </button>

          {formOpen && (
            <form onSubmit={submit} className="mt-4 rounded-[min(1vw,14px)] bg-paper p-5 ring-1 ring-foreground/5">
              <label className="mb-1.5 block text-xs font-medium text-foreground/60" htmlFor="rname">
                Name
              </label>
              <input
                id="rname"
                value={name}
                maxLength={40}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-[min(1vw,10px)] bg-cream px-4 py-2.5 text-sm ring-1 ring-foreground/10 focus:outline-none focus:ring-2 focus:ring-clay/50"
                placeholder="Your name"
              />
              <span className="mb-1.5 mt-4 block text-xs font-medium text-foreground/60">
                Rating
              </span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    aria-label={`${n} star${n > 1 ? "s" : ""}`}
                    onClick={() => setRating(n)}
                    className="p-1 text-clay"
                  >
                    <StarIcon className="h-6 w-6" filled={n <= rating} />
                  </button>
                ))}
              </div>
              <label className="mb-1.5 mt-4 block text-xs font-medium text-foreground/60" htmlFor="rbody">
                Review
              </label>
              <textarea
                id="rbody"
                value={body}
                maxLength={500}
                rows={4}
                onChange={(e) => setBody(e.target.value)}
                className="w-full rounded-[min(1vw,10px)] bg-cream px-4 py-2.5 text-sm ring-1 ring-foreground/10 focus:outline-none focus:ring-2 focus:ring-clay/50"
                placeholder="How was your visit?"
              />
              <button
                type="submit"
                className="mt-4 w-full rounded-[min(1vw,10px)] bg-clay py-3 text-sm font-medium text-paper transition-colors hover:bg-clay/90"
              >
                Submit review
              </button>
            </form>
          )}
        </div>

        <div className="lg:col-span-8">
          <ul className="grid gap-4 sm:grid-cols-2">
            {reviews.map((r) => (
              <li
                key={r.id}
                className="rounded-[min(1vw,14px)] bg-paper p-5 ring-1 ring-foreground/5"
              >
                <div className="flex items-center gap-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-caramel/25 font-serif text-sm">
                    {r.name.charAt(0)}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{r.name}</p>
                    <p className="text-xs text-foreground/45">
                      {new Date(r.date).toLocaleDateString("en-PH", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                <div className="mt-3">
                  <Stars rating={r.rating} className="h-3.5 w-3.5" />
                </div>
                <p className="mt-3 text-sm text-pretty text-foreground/70">{r.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
