import { Request, Response } from 'express';
import httpStatus from 'http-status-codes';

import { ImageService } from '@services/db/imageService';

class Get {
  async proileImages(req: Request, res: Response) {
    const userId = req.currentUser!._id.toString();
    const images = await ImageService.getImages(userId);

    res.status(httpStatus.OK).json({ message: 'Images', images });
  }

  async bgImages(req: Request, res: Response) {
    const userId = req.currentUser!._id.toString();
    const bgImages = await ImageService.getBgImages(userId);

    res.status(httpStatus.OK).json({ message: 'Background images', bgImages });
  }

  async image(req: Request, res: Response) {
    const { imageId } = req.params as { imageId: string };

    const image = await ImageService.getImage(imageId);

    res.status(httpStatus.OK).json({ message: 'Image', image });
  }
}

export const get = new Get();
