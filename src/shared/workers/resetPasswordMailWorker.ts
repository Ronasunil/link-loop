import path from 'path';

import ejs from 'ejs';

import { SendMail } from '@services/email/sendMail';
import { MailQueue } from '@services/queue/mailQueue';

import { forgotPasswordTemplateData, mailTo } from '@utils/features/auth/interfaces/auth.interface';
import { Job } from 'bullmq';

export class ResetPasswordMailWorker {
  private mailQueue: MailQueue = new MailQueue('resetPasswordQueue');

  constructor() {
    this.mailQueue.processQueue(this.sendResetMail);
  }

  async prepareQueue(data: mailTo, userDetails: forgotPasswordTemplateData) {
    const templatePath = path.join(`${__dirname}/../services/email/forgotPassword/forgotPasswordTemplate.ejs`);

    const body = await ejs.renderFile(templatePath, userDetails);
    this.mailQueue.addToQueue({ ...data, body });
  }

  sendResetMail(job: Job) {
    const data = job.data as mailTo;
    new SendMail(data).sendMail();
  }
}
