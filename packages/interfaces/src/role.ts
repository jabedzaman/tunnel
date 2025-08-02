export type Role = "guest" | "user" | "admin";

export type IRole = {
  name: Role;
  level: number;
  permissions: string[];
};

interface RoleBase {
  level: number;
  permissions: string[];
}

const roleConfig: Record<Role, RoleBase> = {
  guest: { level: 0, permissions: [] },
  user: {
    level: 10,
    permissions: ["user:read", "user:update", "user:delete"],
  },
  admin: {
    level: 20,
    permissions: ["user:list"],
  },
};

// Final derived objects
export const roles = Object.fromEntries(
  Object.entries(roleConfig).map(([name, cfg]) => [name, { name, ...cfg }])
) as Record<Role, { name: Role } & RoleBase>;

export const roleLevels: Record<Role, number> = Object.fromEntries(
  Object.entries(roleConfig).map(([k, v]) => [k, v.level])
) as Record<Role, number>;

export const rolePermissions: Record<Role, string[]> = Object.fromEntries(
  Object.entries(roleConfig).map(([k, v]) => [k, v.permissions])
) as Record<Role, string[]>;
