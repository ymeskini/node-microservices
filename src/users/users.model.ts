import mongoose from 'mongoose';

interface IAddress {
  address: string;
  city: string;
  postalCode: string;
  state: string;
  primary: boolean;
  label: string;
}

export interface IUser {
  createdAt: Date;
  modifiedAt: Date;
  email: string;
  auth0Id: string;
  roles: 'admin' | 'user'[];
  status: 'active' | 'closed';

  // optional fields
  firstName?: string;
  lastName?: string;
  gender?: string;
  phone?: string;
  birthDate?: Date;
  avatar?: string;
  addresses?: IAddress[];
}

const userSchema = new mongoose.Schema<IUser>({
  createdAt: {
    type: Date,
    required: true,
    default: new Date(),
  },
  modifiedAt: {
    type: Date,
    required: true,
    default: new Date(),
  },
  email: {
    type: String,
    required: true,
  },
  auth0Id: {
    type: String,
    required: true,
  },
  roles: [
    {
      type: String,
      enum: ['admin', 'user'],
      required: true,
    },
  ],
  status: {
    type: String,
    enum: ['active', 'closed'],
    default: 'active',
  },
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  gender: {
    type: String,
  },
  phone: {
    type: String,
  },
  birthDate: {
    type: Date,
  },
  avatar: {
    type: String,
  },
  addresses: [
    {
      address: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      postalCode: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      primary: {
        type: Boolean,
        required: true,
      },
      label: {
        type: String,
        required: true,
      },
    },
  ],
});

export const User = mongoose.model<IUser>('User', userSchema);
export type UserModel = typeof User;
