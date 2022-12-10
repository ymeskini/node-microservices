export interface UserAddress {
  address: string;
  city: string;
  postal_code: string;
  state: string;
  primary: boolean;
  label: string;
}

export const auth0RolesIds = {
  admin: 'rol_DsScF2N1RsxByDDY',
  customer: 'rol_I8NOsYt3mRlmcxq5',
  supplier: 'rol_zBKeYrrTUJdZsOp0',
} as const;

export type UserRole = keyof typeof auth0RolesIds;
