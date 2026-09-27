import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type StaffAccess = {
  isStaff: boolean;
  isAdmin: boolean;
  canClaimFirstAccount: boolean;
};

/**
 * Access check for the signed-in user. The very first account to reach the
 * dashboard becomes the café admin; after that only an admin can add staff.
 */
export const getMyAccess = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<StaffAccess> => {
    const { data: roles } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId);

    const isAdmin = (roles ?? []).some((r) => r.role === "admin");
    const isStaff = isAdmin || (roles ?? []).some((r) => r.role === "staff");

    if (isStaff) return { isStaff, isAdmin, canClaimFirstAccount: false };

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { count } = await supabaseAdmin
      .from("user_roles")
      .select("id", { count: "exact", head: true });

    return { isStaff: false, isAdmin: false, canClaimFirstAccount: (count ?? 0) === 0 };
  });

export const claimFirstAdmin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { count } = await supabaseAdmin
      .from("user_roles")
      .select("id", { count: "exact", head: true });

    if ((count ?? 0) > 0) throw new Error("An admin already exists. Ask them to add you.");

    const { error } = await supabaseAdmin
      .from("user_roles")
      .insert({ user_id: context.userId, role: "admin" });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const listStaff = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: isAdmin } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (!isAdmin) throw new Error("Forbidden: admins only.");

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: roles } = await supabaseAdmin.from("user_roles").select("user_id, role");
    const { data: users } = await supabaseAdmin.auth.admin.listUsers({ perPage: 200 });

    return (roles ?? []).map((r) => ({
      userId: r.user_id,
      role: r.role,
      email: users?.users.find((u) => u.id === r.user_id)?.email ?? "unknown",
    }));
  });

export const grantStaffRole = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z
      .object({ email: z.string().email(), role: z.enum(["admin", "staff"]).default("staff") })
      .parse(data),
  )
  .handler(async ({ data, context }) => {
    const { data: isAdmin } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (!isAdmin) throw new Error("Forbidden: admins only.");

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: users } = await supabaseAdmin.auth.admin.listUsers({ perPage: 200 });
    const target = users?.users.find(
      (u) => u.email?.toLowerCase() === data.email.toLowerCase(),
    );
    if (!target)
      throw new Error("No account with that email yet — ask them to sign up first.");

    const { error } = await supabaseAdmin
      .from("user_roles")
      .insert({ user_id: target.id, role: data.role });
    if (error && !error.message.includes("duplicate")) throw new Error(error.message);
    return { ok: true };
  });

export const revokeStaffRole = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => z.object({ userId: z.string().uuid() }).parse(data))
  .handler(async ({ data, context }) => {
    const { data: isAdmin } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (!isAdmin) throw new Error("Forbidden: admins only.");
    if (data.userId === context.userId) throw new Error("You can't remove your own access.");

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("user_roles")
      .delete()
      .eq("user_id", data.userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
