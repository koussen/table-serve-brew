import type { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { CartDrawer } from "./CartDrawer";
import { StickyOrderBar } from "./StickyOrderBar";

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -right-24 -top-40 h-[520px] w-[520px] rounded-full bg-caramel/25 blur-3xl" />
        <div className="absolute -left-32 top-1/3 h-[460px] w-[460px] rounded-full bg-sage/25 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-[380px] w-[380px] rounded-full bg-clay/15 blur-3xl" />
      </div>

      <Navbar />
      <main className="mx-auto max-w-6xl px-5 pb-24 md:pb-0">{children}</main>
      <Footer />
      <CartDrawer />
      <StickyOrderBar />
    </div>
  );
}
