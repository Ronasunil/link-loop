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
    console.log(userDetails);
    const body = await ejs.renderFile(templatePath, userDetails);
    await this.mailQueue.addToQueue({ ...data, body });
  }

  async sendResetMail(job: Job) {
    const data = job.data as mailTo;
    await new SendMail(data).sendMail();
  }
}
