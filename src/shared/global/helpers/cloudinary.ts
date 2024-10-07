import { v2 as cloudinary, UploadApiOptions } from 'cloudinary';

class Cloudinary {
  async imageUpload(file: string, publicId?: string, overWrite?: boolean, invalidate?: boolean) {
    const options: UploadApiOptions = {
      public_id: publicId,
      overwrite: overWrite,
      invalidate,
    };

    try {
      const result = await cloudinary.uploader.upload(file, options);
      return result;
    } catch (err) {
      console.log(err);
    }
  }

  async videoUpload(file: string, publicId?: string, overWrite?: boolean, invalidate?: boolean) {
    const options: UploadApiOptions = {
      public_id: publicId,
      overwrite: overWrite,
      invalidate,
      resource_type: 'video',
      chunk_size: 50000,
    };

    try {
      const result = await cloudinary.uploader.upload(file, options);
      return result;
    } catch (err) {
      console.log(err);
    }
  }
}

export const cloudinaryUploader = new Cloudinary();
