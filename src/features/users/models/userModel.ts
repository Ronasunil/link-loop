import mongoose from 'mongoose';
import { userDoc } from '../interface/user.interface';

const userSchema = new mongoose.Schema({
  authId: {
    type: mongoose.Types.ObjectId,
    ref: 'Auth',
    index: true,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },

  dob: {
    type: Date,
  },

  bgImage: {
    type: String,
  },

  passwordResetExpires: {
    type: Date,
  },

  passwordResetToken: {
    type: String,
  },

  isBanned: {
    type: Boolean,
    default: false,
  },

  isDeleted: {
    type: Boolean,
    default: false,
  },

  isVerified: {
    type: Boolean,
    default: false,
  },

  userSetting: {
    storySettings: {
      visibleForFollowers: Boolean,
      visibleForUserOnly: Boolean,
    },

    postSettings: {
      unlisted: {
        type: Boolean,
        default: false,
      },
      public: {
        type: Boolean,
        default: true,
      },
      private: {
        type: Boolean,
        default: false,
      },
    },

    notificationSettings: {
      onFollow: {
        type: Boolean,
        default: true,
      },
      onMessage: {
        type: Boolean,
        default: true,
      },
      onLike: {
        type: Boolean,
        default: true,
      },
    },
  },
  socialMediaLinks: {
    facebook: String,
    instagram: String,
  },

  totalPost: {
    type: Number,
    default: 0,
  },
});

export const userModel = mongoose.model<userDoc>('User', userSchema);
