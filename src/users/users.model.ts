import mongoose from 'mongoose';

interface IUser {
  email: string;
}

const userSchema = new mongoose.Schema<IUser>({
  email: {
    type: String,
    required: true,
  },
});

export const User = mongoose.model<IUser>('User', userSchema);
