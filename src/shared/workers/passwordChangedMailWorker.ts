import ejs from 'ejs';

import path from 'path';

import { SendMail } from '@services/email/sendMail';

import { mailTo, PasswordChangedTemplateData } from '@utils/features/auth/interfaces/auth.interface';
import { Job } from 'bullmq';
import { MailQueue } from '@services/queue/mailQueue';

export class PasswordChangedMailWorker {
  private mailQueue: MailQueue = new MailQueue('passwordChangedQueue');

  constructor() {
    this.mailQueue.processQueue(this.sendMail);
  }

  async prepareQueue(data: mailTo, userDetails: PasswordChangedTemplateData) {
    const templatePath = path.join(`${__dirname}/../services/email/passwordChanged/passwordChangedTemplate.ejs`);
    const body = await ejs.renderFile(templatePath, userDetails);
    this.mailQueue.addToQueue({ ...data, body });
  }

  async sendMail(job: Job) {
    const data = job.data as mailTo;
    await new SendMail(data).sendMail();
  }
}
