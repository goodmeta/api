import { bind, BindingScope } from '@loopback/core'
import { createTransport, SentMessageInfo } from 'nodemailer'
import { EmailTemplate, User, UserResetCredential } from '../models'

@bind({ scope: BindingScope.TRANSIENT })
export class EmailService {
  /**
   * If using gmail see https://nodemailer.com/usage/using-gmail/
   */
  private static async setupTransporter() {
    return createTransport({
      host: process.env.SMTP_SERVER,
      port: +process.env.SMTP_PORT!,
      secure: false, // upgrade later with STARTTLS
      auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD,
      },
    })
  }

  async sendResetPasswordMail(
    user: User,
    credential: UserResetCredential,
  ): Promise<SentMessageInfo> {
    const transporter = await EmailService.setupTransporter()
    const emailTemplate = new EmailTemplate({
      to: user.email,
      subject: '[Shilly] Reset Password Request',
      html: `
      <div>
          <p>Hello, ${user.name}</p>
          <p style="color: red;">We received a request to reset the password for your account with email address: ${user.email}</p>
          <p>To reset your password click on the link provided below</p>
          <a href="${process.env.APPLICATION_URL}/reset-password-finish.html?resetKey=${credential.resetKey}">Reset your password link</a>
          <p>If you didn’t request to reset your password, please ignore this email or reset your password to protect your account.</p>
          <p>Thanks</p>
          <p>Sponsee'ers at Shilly</p>
      </div>
      `,
    })
    return transporter.sendMail(emailTemplate)
  }
}
