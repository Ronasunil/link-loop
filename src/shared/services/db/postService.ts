import { postDoc, postUpdationProps } from '@post/interfaces/postInterfaces';
import { postModel } from '@post/models/postModel';
import mongoose from 'mongoose';

export class PostService {
  static async getPostbyAuthIdDb(authId: string, skip: number, limit: number): Promise<postDoc[]> {
    const posts = await postModel.find({ authId }).skip(skip).limit(limit);
    return posts;
  }

  static async getPostImagesByAuthIdDb(authId: string, skip: number, limit: number): Promise<postDoc[] | null> {
    const posts = await postModel.find({ authId, imageId: { $nin: [''] }, imageVersion: { $nin: [''] } });
    return posts;
  }

  static async getPostByIdDb(id: string | mongoose.Types.ObjectId): Promise<postDoc[] | null> {
    return postModel.findById(id);
  }

  static async getAllPostsDb(skip: number, limit: number): Promise<postDoc[]> {
    return await postModel.find({}).skip(skip).limit(limit);
  }

  static async getUserPostsDb(authId: string): Promise<string[]> {
    const usersPost = (await postModel.find({ authId }).select('_id').lean().distinct('_id')).map((id) => `post:${id}`);
    return usersPost;
  }

  static async deletePostsDb(postId: string): Promise<void> {
    await postModel.findByIdAndDelete(postId);
  }

  static async updatePostDb(postId: string, data: postUpdationProps): Promise<postDoc | null> {
    const post = await postModel.findByIdAndUpdate(postId, data, { new: true, runValidators: true });

    return post;
  }
}
