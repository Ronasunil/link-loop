import nodemailer from 'nodemailer';
import sendGridMail from '@sendgrid/mail';

import { BadRequestError } from '@global/helpers/errorHandler';
import { config } from '@utils/config';
import { mailOptions, mailTo } from '@utils/features/auth/interfaces/auth.interface';

export class SendMail {
  public mailOptions: mailOptions;
  constructor(public emailBody: mailTo) {
    this.mailOptions = {
      from: `"LinkLoop, Kerala 👻" <${config.ETHEREAL_EMAIL}>`,
      to: emailBody.to,
      subject: emailBody.subject,
      html: emailBody.body,
    };
  }
  protected async developmentMailSender() {
    const transporter = nodemailer.createTransport({
      host: config.ETHEREAL_HOST,
      port: config.ETHEREAL_PORT,
      secure: false,
      auth: {
        user: config.ETHEREAL_EMAIL,
        pass: config.ETHEREAL_PASSWORD,
      },
    });

    transporter.sendMail(this.mailOptions).catch((err) => {
      console.log(err);
      throw new BadRequestError('Something went wrong');
    });
  }

  protected async productionMailSender() {
    const transporter = nodemailer.createTransport({
      host: config.BREVO_HOST,
      port: config.BREVO_PORT,
      secure: false,
      auth: {
        user: config.BREVO_EMAIL,
        pass: config.BREVO_PASSWORD,
      },
    });

    transporter.sendMail(this.mailOptions).catch((err) => {
      console.log(err);
      throw new BadRequestError('Something went wrong');
    });
  }

  async sendMail() {
    if (config.NODE_ENV === 'development') this.developmentMailSender();
    else this.productionMailSender();
  }
}
