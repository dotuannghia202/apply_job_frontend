import type { RoleName } from "@/types/auth";

const ROLE_NAMES: readonly RoleName[] = ["ADMIN", "EMPLOYER", "CANDIDATE"];

function toRoleName(value: unknown): RoleName | null {
  if (typeof value === "string") {
    const normalized = value.toUpperCase().replace(/^ROLE_/, "");

    return ROLE_NAMES.includes(normalized as RoleName)
      ? (normalized as RoleName)
      : null;
  }

  if (typeof value === "object" && value !== null) {
    const role = value as Record<string, unknown>;

    return (
      toRoleName(role.name) ??
      toRoleName(role.roleName) ??
      toRoleName(role.authority)
    );
  }

  return null;
}

export function normalizeRoles(roles: unknown): RoleName[] {
  if (!Array.isArray(roles)) return [];

  return roles.reduce<RoleName[]>((normalizedRoles, role) => {
    const normalizedRole = toRoleName(role);

    if (normalizedRole && !normalizedRoles.includes(normalizedRole)) {
      normalizedRoles.push(normalizedRole);
    }

    return normalizedRoles;
  }, []);
}
