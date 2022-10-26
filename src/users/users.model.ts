import mongoose from 'mongoose';

interface IUser {
  createdAt: Date;
  modifiedAt: Date;
  email: string;
  permissionLevel: 'Admin' | 'User';
  firstName: string;
  lastName: string;
  gender: 'male' | 'female';
  phone: string;
  username: string;
  password: string;
  birthDate: Date;
  avatar: string;
  status: 'active' | 'closed';
  addresses: {
    address: string;
    city: string;
    postalCode: string;
    state: string;
    primary: boolean;
    label: string;
  }[];
}

const userSchema = new mongoose.Schema<IUser>({
  createdAt: {
    type: Date,
    required: true,
  },
  modifiedAt: {
    type: Date,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  permissionLevel: {
    type: String,
    enum: ['Admin', 'User'],
    default: 'User',
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    enum: ['male', 'female'],
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    min: 6,
  },
  password: {
    type: String,
    required: true,
    min: 8,
  },
  birthDate: {
    type: Date,
    required: true,
  },
  avatar: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['active', 'closed'],
    default: 'active',
    required: true,
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
