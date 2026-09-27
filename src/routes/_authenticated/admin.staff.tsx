import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "sonner";
import { listStaff, grantStaffRole, revokeStaffRole } from "@/lib/staff.functions";

export const Route = createFileRoute("/_authenticated/admin/staff")({
  component: StaffPage,
});

function StaffPage() {
  const queryClient = useQueryClient();
  const fetchStaff = useServerFn(listStaff);
  const grant = useServerFn(grantStaffRole);
  const revoke = useServerFn(revokeStaffRole);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"staff" | "admin">("staff");

  const { data: staff = [], error } = useQuery({
    queryKey: ["staff-list"],
    queryFn: () => fetchStaff({ data: undefined }),
  });

  const refresh = () => queryClient.invalidateQueries({ queryKey: ["staff-list"] });

  if (error) {
    return <p className="py-16 text-center text-sm text-foreground/60">{error.message}</p>;
  }

  return (
    <div className="max-w-2xl">
      <p className="eyebrow">Access</p>
      <h1 className="mt-2 text-2xl font-semibold">Who can see orders</h1>
      <p className="mt-2 text-sm text-foreground/60">
        Team members sign up first, then you add their email here. Customers never see order data.
      </p>

      <form
        onSubmit={async (e) => {
          e.preventDefault();
          try {
            await grant({ data: { email, role } });
            setEmail("");
            refresh();
            toast.success("Access granted.");
          } catch (err) {
            toast.error(err instanceof Error ? err.message : "Couldn't grant access.");
          }
        }}
        className="mt-6 flex flex-wrap gap-2"
      >
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="teammate@email.com"
          className="min-w-[220px] flex-1 rounded-[min(1vw,10px)] bg-paper px-4 py-3 text-sm ring-1 ring-foreground/10 outline-none focus:ring-clay"
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as "staff" | "admin")}
          className="rounded-[min(1vw,10px)] bg-paper px-4 py-3 text-sm ring-1 ring-foreground/10"
        >
          <option value="staff">Staff</option>
          <option value="admin">Admin</option>
        </select>
        <button
          type="submit"
          className="rounded-[min(1vw,10px)] bg-espresso px-5 py-3 text-sm font-medium text-paper"
        >
          Add
        </button>
      </form>

      <ul className="mt-8 divide-y divide-foreground/10 rounded-[min(1.4vw,16px)] bg-paper px-5 ring-1 ring-foreground/5">
        {staff.map((s) => (
          <li key={`${s.userId}-${s.role}`} className="flex items-center justify-between gap-3 py-4">
            <div>
              <p className="text-sm font-medium">{s.email}</p>
              <p className="text-xs uppercase tracking-[0.15em] text-foreground/45">{s.role}</p>
            </div>
            <button
              type="button"
              onClick={async () => {
                try {
                  await revoke({ data: { userId: s.userId } });
                  refresh();
                  toast.success("Access removed.");
                } catch (err) {
                  toast.error(err instanceof Error ? err.message : "Couldn't remove access.");
                }
              }}
              className="text-xs text-clay underline underline-offset-4"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
