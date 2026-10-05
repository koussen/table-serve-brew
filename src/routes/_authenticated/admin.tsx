import { createFileRoute, Link, Outlet, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { getMyAccess, claimFirstAdmin } from "@/lib/staff.functions";
import { shop } from "@/lib/shop";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin")({
  component: AdminLayout,
  errorComponent: ({ error }) => (
    <div className="mx-auto max-w-md px-5 py-24 text-center">
      <h1 className="font-serif text-2xl font-semibold">Something went wrong</h1>
      <p className="mt-2 text-sm text-foreground/60">{error instanceof Error ? error.message : String(error)}</p>
    </div>
  ),
});

function AdminLayout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const fetchAccess = useServerFn(getMyAccess);
  const claim = useServerFn(claimFirstAdmin);

  const { data: access, isPending } = useQuery({
    queryKey: ["staff-access"],
    queryFn: () => fetchAccess({ data: undefined }),
  });

  const signOut = async () => {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  };

  if (isPending) {
    return <div className="py-24 text-center text-sm text-foreground/50">Checking access…</div>;
  }

  if (!access?.isStaff) {
    return (
      <div className="mx-auto max-w-md px-5 py-24 text-center">
        <h1 className="font-serif text-2xl font-semibold">Staff access needed</h1>
        {access?.canClaimFirstAccount ? (
          <>
            <p className="mt-3 text-sm text-foreground/60">
              No manager account exists yet. Claim this one to become the café admin.
            </p>
            <button
              type="button"
              onClick={async () => {
                try {
                  await claim({ data: undefined });
                  queryClient.invalidateQueries({ queryKey: ["staff-access"] });
                } catch (err) {
                  toast.error(err instanceof Error ? err.message : "Couldn't claim access.");
                }
              }}
              className="mt-5 rounded-[min(1vw,10px)] bg-espresso px-6 py-3 text-sm font-medium text-paper"
            >
              Make me the café admin
            </button>
          </>
        ) : (
          <p className="mt-3 text-sm text-foreground/60">
            Ask a {shop.name} manager to add your email to the staff list.
          </p>
        )}
        <button
          type="button"
          onClick={signOut}
          className="mt-6 block w-full text-xs text-foreground/55 underline underline-offset-4"
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <header className="border-b border-foreground/10 bg-paper/70">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-4 px-5 py-4">
          <span className="font-serif text-lg font-semibold">{shop.name} counter</span>
          <nav className="flex gap-4 text-sm text-foreground/70">
            <Link
              to="/admin"
              activeOptions={{ exact: true }}
              activeProps={{ className: "text-foreground font-medium" }}
            >
              Orders
            </Link>
            <Link to="/admin/tables" activeProps={{ className: "text-foreground font-medium" }}>
              Table QR codes
            </Link>
            {access.isAdmin && (
              <Link to="/admin/staff" activeProps={{ className: "text-foreground font-medium" }}>
                Staff
              </Link>
            )}
          </nav>
          <div className="ml-auto flex items-center gap-3">
            <Link to="/" className="text-sm text-foreground/60 hover:text-foreground">
              View site
            </Link>
            <button
              type="button"
              onClick={signOut}
              className="rounded-[min(1vw,10px)] px-3 py-2 text-sm ring-1 ring-foreground/15 hover:bg-foreground/5"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-5 py-8">
        <Outlet />
      </main>
    </div>
  );
}
