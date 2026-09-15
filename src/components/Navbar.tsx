import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { useOrder } from "@/lib/order-store";
import { shop } from "@/lib/shop";
import { BagIcon, CloseIcon, MenuIcon } from "./Icons";

const links = [
  { to: "/menu", label: "Menu" },
  { to: "/about", label: "Our Story" },
  { to: "/reviews", label: "Reviews" },
  { to: "/contact", label: "Visit" },
] as const;

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { itemCount, setCartOpen } = useOrder();

  return (
    <header className="sticky top-0 z-40">
      <nav className="mx-auto max-w-6xl px-5">
        <div className="soft mt-4 flex items-center justify-between rounded-[min(1vw,14px)] px-4 py-3 ring-1 ring-foreground/5 sm:px-5">
          <Link to="/" className="flex min-w-0 items-baseline gap-2">
            <span className="font-serif text-lg font-semibold tracking-tight sm:text-xl">
              {shop.name}
            </span>
            <span className="hidden text-xs uppercase tracking-[0.18em] text-foreground/45 sm:inline">
              Batangas
            </span>
          </Link>

          <div className="hidden items-center gap-8 text-sm text-foreground/70 md:flex">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                activeProps={{ className: "text-foreground" }}
                className="transition-colors hover:text-foreground"
              >
                {l.label}
              </Link>
            ))}
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => setCartOpen(true)}
              aria-label={`Open order (${itemCount} items)`}
              className="relative grid h-10 w-10 place-items-center rounded-[min(1vw,10px)] text-foreground/75 transition-colors hover:bg-foreground/5 hover:text-foreground"
            >
              <BagIcon className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-clay px-1 text-[11px] font-medium text-paper">
                  {itemCount}
                </span>
              )}
            </button>
            <Link
              to="/menu"
              className="hidden rounded-[min(1vw,10px)] bg-espresso px-4 py-2 text-sm font-medium text-paper transition-colors hover:bg-espresso/90 sm:inline-block"
            >
              Order Now
            </Link>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close menu" : "Open menu"}
              className="grid h-10 w-10 place-items-center rounded-[min(1vw,10px)] text-foreground/75 transition-colors hover:bg-foreground/5 md:hidden"
            >
              {open ? <MenuIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {open && (
          <div className="soft mt-2 rounded-[min(1vw,14px)] p-2 ring-1 ring-foreground/5 md:hidden">
            <div className="flex items-center justify-between px-3 py-2">
              <span className="text-xs uppercase tracking-[0.18em] text-foreground/45">
                Navigate
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="grid h-8 w-8 place-items-center rounded-md text-foreground/60"
              >
                <CloseIcon className="h-4 w-4" />
              </button>
            </div>
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="block rounded-[min(1vw,10px)] px-3 py-3 text-base text-foreground/80 transition-colors hover:bg-foreground/5"
              >
                {l.label}
              </Link>
            ))}
            <Link
              to="/menu"
              onClick={() => setOpen(false)}
              className="mt-1 block rounded-[min(1vw,10px)] bg-espresso px-3 py-3 text-center text-sm font-medium text-paper"
            >
              Order Now
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
