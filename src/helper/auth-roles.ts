import type { AuthUser, RoleName } from "@/types/auth";
import type { User } from "@/types/user";

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

export function getAccountUser(
  data: User | { user: User } | null | undefined,
): User | null {
  if (!data) return null;
  return "user" in data ? data.user : data;
}

export function mapAccountToAuthUser(user: User): AuthUser {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    avatarUrl: user.avatarUrl ?? (user as { avatar?: string | null }).avatar ?? null,
    isActive: user.isActive ?? null,
    roles: normalizeRoles(user.roles ?? []),
    company: user.company
      ? {
          id: user.company.id,
          name: user.company.name,
        }
      : null,
    isGmailLinked: (user as { isGmailLinked?: boolean | null }).isGmailLinked ?? null,
  };
}

