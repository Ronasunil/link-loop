import mongoose from 'mongoose';

interface conversationDoc extends mongoose.Document {
  senderId: string | mongoose.Types.ObjectId;
  receiverId: string | mongoose.Types.ObjectId;
}

const conversationSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    index: true,
  },

  receiverId: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    index: true,
  },
});

export const conversationModel = mongoose.model<conversationDoc>('Converstion', conversationSchema);
