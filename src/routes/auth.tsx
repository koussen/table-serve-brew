import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { SiteLayout } from "@/components/SiteLayout";
import { shop } from "@/lib/shop";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Staff Sign In — Kape & Klase" },
      {
        name: "description",
        content: "Café staff sign in to view and manage incoming Kape & Klase orders.",
      },
      { property: "og:title", content: "Staff Sign In — Kape & Klase" },
      {
        property: "og:description",
        content: "Café staff sign in to manage incoming orders.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/admin", replace: true });
    });
  }, [navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate({ to: "/admin", replace: true });
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin + "/auth" },
        });
        if (error) throw error;
        if (!data.session) {
          toast.success("Check your email to confirm the account, then sign in.");
        } else {
          navigate({ to: "/admin", replace: true });
        }
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Sign in failed.");
    } finally {
      setBusy(false);
    }
  };

  const google = async () => {
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin + "/auth",
    });
    if (result.error) {
      toast.error("Google sign-in failed. Please try again.");
      return;
    }
    if (result.redirected) return;
    navigate({ to: "/admin", replace: true });
  };

  return (
    <SiteLayout>
      <section className="mx-auto max-w-md pt-16 pb-24">
        <p className="eyebrow">Staff only</p>
        <h1 className="mt-3 text-3xl font-semibold">
          {mode === "signin" ? "Sign in to the counter" : "Create a staff account"}
        </h1>
        <p className="mt-3 text-sm text-foreground/60">
          Order details are visible to {shop.name} staff only.
        </p>

        <form onSubmit={submit} className="mt-8 space-y-3">
          <label className="block">
            <span className="text-xs uppercase tracking-[0.15em] text-foreground/50">Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1.5 w-full rounded-[min(1vw,10px)] bg-paper px-4 py-3 text-sm ring-1 ring-foreground/10 outline-none focus:ring-clay"
            />
          </label>
          <label className="block">
            <span className="text-xs uppercase tracking-[0.15em] text-foreground/50">
              Password
            </span>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1.5 w-full rounded-[min(1vw,10px)] bg-paper px-4 py-3 text-sm ring-1 ring-foreground/10 outline-none focus:ring-clay"
            />
          </label>
          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-[min(1vw,10px)] bg-espresso py-3.5 text-sm font-medium text-paper disabled:opacity-60"
          >
            {busy ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
          </button>
        </form>

        <div className="my-5 flex items-center gap-3 text-xs uppercase tracking-[0.15em] text-foreground/35">
          <span className="h-px flex-1 bg-foreground/10" /> or <span className="h-px flex-1 bg-foreground/10" />
        </div>

        <button
          type="button"
          onClick={google}
          className="w-full rounded-[min(1vw,10px)] bg-paper py-3.5 text-sm font-medium ring-1 ring-foreground/10 transition-colors hover:bg-foreground/5"
        >
          Continue with Google
        </button>

        <button
          type="button"
          onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          className="mt-6 w-full text-xs text-foreground/55 underline underline-offset-4"
        >
          {mode === "signin"
            ? "New staff member? Create an account"
            : "Already have an account? Sign in"}
        </button>
      </section>
    </SiteLayout>
  );
}
