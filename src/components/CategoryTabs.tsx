import { categories } from "@/lib/shop";
import type { CategoryId } from "@/lib/types";

export function CategoryTabs({
  active,
  onChange,
}: {
  active: CategoryId;
  onChange: (id: CategoryId) => void;
}) {
  return (
    <div className="-mx-5 overflow-x-auto px-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div className="inline-flex gap-1 rounded-[min(1vw,12px)] bg-paper p-1 ring-1 ring-foreground/5">
        {categories.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => onChange(c.id)}
            className={`whitespace-nowrap rounded-[min(1vw,10px)] px-4 py-2.5 text-sm font-medium transition-colors ${
              active === c.id
                ? "bg-espresso text-paper"
                : "text-foreground/60 hover:bg-foreground/5 hover:text-foreground"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>
    </div>
  );
}
