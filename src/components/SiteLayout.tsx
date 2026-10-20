import { useEffect, useRef, type ReactNode } from "react";
import { useLocation } from "@tanstack/react-router";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { CartDrawer } from "./CartDrawer";
import { StickyOrderBar } from "./StickyOrderBar";

export function SiteLayout({ children }: { children: ReactNode }) {
  const pathname = useLocation({ select: (location) => location.pathname });
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !mainRef.current) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("cafe-reveal");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.08 });
    mainRef.current.querySelectorAll("section").forEach((section, index) => {
      if (index > 0) observer.observe(section);
    });
    return () => observer.disconnect();
  }, [pathname]);

  return (
    <div className="relative min-h-screen">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -right-24 -top-40 h-[520px] w-[520px] rounded-full bg-caramel/25 blur-3xl" />
        <div className="absolute -left-32 top-1/3 h-[460px] w-[460px] rounded-full bg-sage/25 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-[380px] w-[380px] rounded-full bg-clay/15 blur-3xl" />
      </div>

      <Navbar />
      <main key={pathname} ref={mainRef} className="cafe-page mx-auto max-w-6xl px-5 pb-24 md:pb-0">{children}</main>
      <Footer />
      <CartDrawer />
      <StickyOrderBar />
    </div>
  );
}
