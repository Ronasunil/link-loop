import { Response } from 'express';
import httpStatus from 'http-status-codes';

import { userCache } from '@services/redis/userCache';
import {
  reqForBasicInfoUpdation,
  reqForNotificationUpdation,
  reqForSocialLinkUpdation,
} from '@users/interface/user.interface';
import { UserWorker } from '@workers/userWorker';

class Update {
  async socialLinks(req: reqForSocialLinkUpdation, res: Response) {
    const { facebook, instagram } = req.body;
    const userId = req.currentUser!._id.toString();

    const updatedUser = await userCache.updateSocialLinks(userId, { facebook, instagram });
    const userWorker = await new UserWorker().prepareQueueForSocialUpdation({ userId, data: { facebook, instagram } });
    userWorker.updateUserSocialLink();

    res.status(httpStatus.OK).json({ message: 'Social link updated', data: updatedUser });
  }

  async basicInfo(req: reqForBasicInfoUpdation, res: Response) {
    const userId = req.currentUser!._id.toString();
    const user = await userCache.updateBasicInfo(userId, { ...req.body });

    const userWorker = await new UserWorker().prepareQueueForBasicInfoUpdation({ userId, data: req.body });
    userWorker.updateBasicInfo();

    res.status(httpStatus.OK).json({ message: 'Basic info updated', user });
  }

  async notification(req: reqForNotificationUpdation, res: Response) {
    const userId = req.currentUser!._id.toString();
    console.log(req.body.onComment);
    const user = await userCache.updateNotification(userId, req.body);
    const userWorker = await new UserWorker().prepareQueueForNotificationUpdation({ userId, data: req.body });

    userWorker.updateNotification();

    res.status(httpStatus.OK).json({ message: 'Notification updated', user });
  }
}

export const update = new Update();
