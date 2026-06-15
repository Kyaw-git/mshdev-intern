// import { Injectable } from '@nestjs/common';
// import * as nodemailer from 'nodemailer';
// import * as SMTPTransport from 'nodemailer/lib/smtp-transport';
// import * as dns from 'dns';

// @Injectable()
// export class MailService {
//   private transporter: nodemailer.Transporter;

//   constructor() {
//     const isSecure = process.env.MAIL_PORT === '465'

//     const transportOptions: SMTPTransport.Options = {
//       host: process.env.MAIL_HOST || 'smtp.gmail.com',
//       port: parseInt(process.env.MAIL_PORT || '587'),
//       secure: isSecure,
//       auth: {
//         user: process.env.MAIL_USER,
//         pass: process.env.MAIL_PASS,
//       },
//       connectionTimeout: 15000,
//       greetingTimeout: 15000,
//       // @ts-ignore
//       lookup: (
//         hostname: string,
//         options: dns.LookupOneOptions,
//         callback: (err: NodeJS.ErrnoException | null, address: string, family: number) => void
//       ) => {
//         return dns.lookup(hostname, { family: 4 }, callback);
//       },
//       tls: {
//         rejectUnauthorized: false,
//         minVersion: 'TLSv1.2',
//       }
//     };

//     this.transporter = nodemailer.createTransport(transportOptions);
//   }

//   async sendOtp(to: string, code: string): Promise<void> {
//     const mailOptions = {
//       from: `"Clothing Store Admin" <${process.env.MAIL_USER}>`,
//       to: to,
//       subject: 'Your Registration OTP Code',
//       html: `
//         <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; max-width: 500px; margin: auto;">
//           <h2 style="color: #333;">Welcome to Our Clothing Store!</h2>
//           <p>Please use the following One-Time Password (OTP) to verify your account:</p>
//           <div style="background-color: #f9f9f9; padding: 15px; text-align: center; border-radius: 4px; margin: 20px 0;">
//             <h1 style="color: #f81349; font-size: 40px; letter-spacing: 5px; margin: 0;">${code}</h1>
//           </div>
//           <p style="color: #666; font-size: 13px;">This code will expire in 5 minutes.</p>
//         </div>
//       `,
//     };

//     try {
//       const info = await this.transporter.sendMail(mailOptions);
//       console.log('📧 [Nodemailer OTP Sent Success]:', info.messageId);
//     } catch (error: any) {
//       console.error('❌ Failed to send OTP email:', error.message);
//       throw error;
//     }
//   }

//   async sendStatusNotification(to: string, status: 'APPROVED' | 'REJECTED'): Promise<void> {
//     const isApproved = status === 'APPROVED';
//     const mailOptions = {
//       from: `"Clothing Store Admin" <${process.env.MAIL_USER}>`,
//       to: to,
//       subject: `Account Registration ${status}`,
//       html: `
//         <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; max-width: 500px; margin: auto;">
//           <h2 style="color: #333;">Account Status Update</h2>
//           <p>Dear User,</p>
//           <p>Your registration request has been <b>${status}</b> by the administrator.</p>
//           <div style="margin: 20px 0;">
//             ${isApproved ?
//               '<p style="color: #2e7d32; font-weight: bold; background-color: #e8f5e9; padding: 10px; border-radius: 4px;">You can now log in to your account and start shopping!</p>' :
//               '<p style="color: #c62828; font-weight: bold; background-color: #ffebee; padding: 10px; border-radius: 4px;">Unfortunately, your request did not meet our criteria. Please contact support for more details.</p>'}
//           </div>
//           <br/>
//           <p style="color: #555; margin: 0;">Best Regards,</p>
//           <p style="font-weight: bold; color: #333; margin: 5px 0 0 0;">Clothing Store Team</p>
//         </div>
//       `,
//     };

//     try {
//       const info = await this.transporter.sendMail(mailOptions);
//       console.log(' [Nodemailer Status Sent Success]:', info.messageId);
//     } catch (error: any) {
//       console.error(' Failed to send Status email:', error.message);
//       throw error;
//     }
//   }
// }

// -----------------------------------------------------
import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class MailService {
  private resend: Resend;

  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY);
  }

  async sendOtp(to: string, code: string): Promise<void> {
    try {
      const { data, error } = await this.resend.emails.send({
        from: 'Clothing Store <onboarding@resend.dev>',
        to: [to],
        subject: 'Your Registration OTP Code',
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; max-width: 500px; margin: auto;">
            <h2 style="color: #333;">Welcome to Our Clothing Store!</h2>
            <p>Please use the following One-Time Password (OTP) to verify your account:</p>
            <div style="background-color: #f9f9f9; padding: 15px; text-align: center; border-radius: 4px; margin: 20px 0;">
              <h1 style="color: #f81349; font-size: 40px; letter-spacing: 5px; margin: 0;">${code}</h1>
            </div>
            <p style="color: #666; font-size: 13px;">This code will expire in 5 minutes.</p>
          </div>
        `,
      });

      if (error) {
        throw new Error(error.message);
      }

      console.log('📧 [Resend OTP Sent Success]:', data?.id);
    } catch (error: any) {
      console.error('❌ Failed to send OTP email via Resend:', error.message);
      throw error;
    }
  }

  async sendStatusNotification(
    to: string,
    status: 'APPROVED' | 'REJECTED',
  ): Promise<void> {
    const isApproved = status === 'APPROVED';
    try {
      const { data, error } = await this.resend.emails.send({
        from: 'Clothing Store <onboarding@resend.dev>',
        to: [to],
        subject: `Account Registration ${status}`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; max-width: 500px; margin: auto;">
            <h2 style="color: #333;">Account Status Update</h2>
            <p>Dear User,</p>
            <p>Your registration request has been <b>${status}</b> by the administrator.</p>
            <div style="margin: 20px 0;">
              ${
                isApproved
                  ? '<p style="color: #2e7d32; font-weight: bold; background-color: #e8f5e9; padding: 10px; border-radius: 4px;">You can now log in to your account and start shopping!</p>'
                  : '<p style="color: #c62828; font-weight: bold; background-color: #ffebee; padding: 10px; border-radius: 4px;">Unfortunately, your request did not meet our criteria. Please contact support for more details.</p>'
              }
            </div>
            <br/>
            <p style="color: #555; margin: 0;">Best Regards,</p>
            <p style="font-weight: bold; color: #333; margin: 5px 0 0 0;">Clothing Store Team</p>
          </div>
        `,
      });

      if (error) {
        throw new Error(error.message);
      }

      console.log('📧 [Resend Status Sent Success]:', data?.id);
    } catch (error: any) {
      console.error(
        '❌ Failed to send Status email via Resend:',
        error.message,
      );
      throw error;
    }
  }
}
