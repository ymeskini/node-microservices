export interface UserAddress {
  address: string;
  city: string;
  postal_code: string;
  state: string;
  primary: boolean;
  label: string;
}

export type UserRole = 'admin' | 'customer' | 'supplier';

export const auth0RolesIds: Record<UserRole, string> = {
  admin: 'rol_DsScF2N1RsxByDDY',
  customer: 'rol_I8NOsYt3mRlmcxq5',
  supplier: 'rol_zBKeYrrTUJdZsOp0',
};
