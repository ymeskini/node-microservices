interface IAddress {
  address: string;
  city: string;
  postalCode: string;
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

export interface IUser extends Document {
  createdAt: Date;
  modifiedAt: Date;
  email: string;
  roles: UserRole[];
  status: 'active' | 'closed';

  // fields from auth0
  tenant: string; // "ym-toptal"
  connection: string; // "Username-Password-Authentication"
  password: string;

  // optional fields
  firstName?: string;
  lastName?: string;
  gender?: string;
  phone?: string;
  birthDate?: Date;
  addresses?: IAddress[];
}
