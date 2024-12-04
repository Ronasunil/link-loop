import nodemailer from 'nodemailer';

import { BadRequestError } from '@global/helpers/errorHandler';
import { config } from '@utils/config';
import { mailOptions, mailTo } from '@utils/features/auth/interfaces/auth.interface';

export class SendMail {
  public mailOptions: mailOptions;
  constructor(public emailBody: mailTo) {
    console.log(`${config.NODE_ENV === 'development' ? config.ETHEREAL_EMAIL : config.BREVO_SENDER_EMAIL}`);
    this.mailOptions = {
      from: `"LinkLoop, Kerala 👻" <${config.NODE_ENV === 'development' ? config.ETHEREAL_EMAIL : config.BREVO_SENDER_EMAIL}>`,
      to: emailBody.to,
      subject: emailBody.subject,
      html: emailBody.body,
    };
  }
  protected async developmentMailSender() {
    console.log(config.ETHEREAL_PASSWORD, config.ETHEREAL_EMAIL);
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
      host: 'smtp-relay.brevo.com',
      port: config.BREVO_PORT,
      secure: true,
      auth: {
        user: config.BREVO_EMAIL,
        pass: config.BREVO_PASSWORD,
      },
    });

    try {
      const info = await transporter.sendMail(this.mailOptions);
    } catch (err) {
      console.log(err);
      throw new BadRequestError('Something went wrong');
    }
  }

  async sendMail() {
    console.log(config.NODE_ENV, config.NODE_ENV === 'development');
    if (config.NODE_ENV === 'development') this.developmentMailSender();
    else this.productionMailSender();
  }
}
