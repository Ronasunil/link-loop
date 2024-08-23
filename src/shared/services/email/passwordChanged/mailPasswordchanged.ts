import nodemailer from 'nodemailer';
import sendGridMail from '@sendgrid/mail';

import { config } from '@utils/config';
import { mailTo } from '@utils/features/auth/interfaces/auth.interface';
import { BadRequestError } from '@global/helpers/errorHandler';

class MailForgetPassword {
  protected async developmentMailSender(emailBody: mailTo) {
    const transporter = nodemailer.createTransport({
      host: config.ETHEREAL_HOST,
      port: config.ETHEREAL_PORT,
      secure: false,
      auth: {
        user: config.ETHEREAL_PASSWORD,
        pass: config.ETHEREAL_PASSWORD,
      },
    });

    const mailOptions = {
      from: `"LinkLoop, Kerala 👻" <${config.ETHEREAL_EMAIL}>`,
      to: emailBody.to,
      subject: emailBody.subject,
      html: emailBody.body,
    };

    transporter.sendMail(mailOptions).catch((err) => {
      console.log(err);
      throw new BadRequestError('Something went wrong');
    });
  }

  protected async productionMailSender(emailBody: mailTo) {
    const mailOptions = {
      from: `"LinkLoop, Kerala 👻" <${config.ETHEREAL_EMAIL}>`,
      to: emailBody.to,
      subject: emailBody.subject,
      html: emailBody.body,
    };

    await sendGridMail.send(mailOptions).catch((err) => {
      console.log(err);
      throw new BadRequestError('Something went wrong');
    });
  }

  async sendMail(obj: mailTo) {
    if (config.NODE_ENV === 'development') this.developmentMailSender(obj);
    else this.productionMailSender(obj);
  }
}
