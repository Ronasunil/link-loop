import mongoose from 'mongoose';
import { authDoc } from '../interfaces/auth.interface';
import { compare, hash } from 'bcrypt';

const authSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
    },

    passwordResetExpires: {
      type: Date,
    },

    passwordResetToken: {
      type: String,
      default: '',
    },

    avatarColor: {
      type: String,
    },

    avatarImage: {
      type: String,
    },

    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    toJSON: {
      transform(_doc, ret) {
        delete ret.password;
      },
    },
  }
);

authSchema.methods.comparePassword = async function (password: string) {
  const userPassword = (this as authDoc).password;
  const isPasswordCorrect = await compare(password, userPassword);

  return isPasswordCorrect;
};

// prettier-ignore
authSchema.methods.hashPassword = async function (password: string): Promise<string> {
  return await hash(password, 12);
};

authSchema.pre('save', async function (this: authDoc, next: () => void) {
  if (!this.isModified('password')) return next();

  this.password = await this.hashPassword(this.password);
  next();
});

export const authModel = mongoose.model<authDoc>('Auth', authSchema);
