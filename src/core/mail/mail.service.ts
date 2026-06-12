// import { Injectable } from '@nestjs/common';
// import * as nodemailer from 'nodemailer';

// @Injectable()
// export class MailService {
//   private transporter;

//   constructor() {
//     this.transporter = nodemailer.createTransport({
//       host: process.env.MAIL_HOST || 'smtp.mailtrap.io',
//       port: parseInt(process.env.MAIL_PORT || '2525'),
//       auth: {
//         user: process.env.MAIL_USER || '',
//         pass: process.env.MAIL_PASS || '',
//       },
//     });
//   }

//   async sendOtp(to: string, code: string): Promise<void> {
//     const mailOptions = {
//       from: '"Clothing Store" <noreply@clothingstore.com>',
//       to,
//       subject: 'Your Registration OTP Code',
//       html: `<h3>Welcome!</h3><p>Your OTP verification code is: <b>${code}</b>. It will expire in 5 minutes.</p>`,
//     };
//     await this.transporter.sendMail(mailOptions);
//   }

//   async sendStatusNotification(to: string, status: 'APPROVED' | 'REJECTED'): Promise<void> {
//     const isApproved = status === 'APPROVED';
//     const mailOptions = {
//       from: '"Clothing Store" <noreply@clothingstore.com>',
//       to,
//       subject: `Account Registration ${status}`,
//       html: `<h3>Account Update</h3>
//              <p>Your registration request has been <b>${status.toLowerCase()}</b> by the administrator.</p>
//              ${isApproved ? '<p>You can now log in to your account.</p>' : '<p>Please contact support for details.</p>'}`,
//     };
//     await this.transporter.sendMail(mailOptions);
//   }
// }



// import { Injectable } from '@nestjs/common';

// @Injectable()
// export class MailService {
//   constructor() {}

//   async sendOtp(to: string, code: string): Promise<void> {
//     console.log('-----------------------------------------');
//     console.log(`📧 [EMAIL SIMULATOR] Sending OTP to: ${to}`);
//     console.log(`🔑 Verification Code: ${code}`);
//     console.log('-----------------------------------------');
//   }

//   async sendStatusNotification(to: string, status: 'APPROVED' | 'REJECTED'): Promise<void> {
//     console.log('-----------------------------------------');
//     console.log(`📧 [EMAIL SIMULATOR] Sending Status Update to: ${to}`);
//     console.log(`📢 Your registration has been: ${status}`);
//     console.log('-----------------------------------------');
//   }
// }

// import { Injectable } from '@nestjs/common';
// import * as nodemailer from 'nodemailer';

// @Injectable()
// export class MailService {
//   private transporter: nodemailer.Transporter;

//   constructor() {
//     this.transporter = nodemailer.createTransport({
//       host: process.env.MAIL_HOST,
//       port: parseInt(process.env.MAIL_PORT || '465'),
//       secure: true,
//       auth: {
//         user: process.env.MAIL_USER,
//         pass: process.env.MAIL_PASS,
//       },
//     });
//   }

//   async sendOtp(to: string, code: string): Promise<void> {
//     const mailOptions = {
//       from: `"Your Phone Hacked by Admin" <${process.env.MAIL_USER}>`,
//       to: to,
//       subject: 'Your Registration OTP Code',
//       // html: `
//       //   <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee;">
//       //     <h2>Welcome to Our Clothing Store!</h2>
//       //     <p>Please use the following One-Time Password (OTP) to verify your account:</p>
//       //     <h1 style="color: #4CAF50; font-size: 40px; letter-spacing: 5px;">${code}</h1>
//       //     <p>This code will expire in 5 minutes.</p>
//       //   </div>
//       // `
//       html: `
//         <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee;">
//           <h2>Welcome to Our Clothing Store!</h2>
//           <p> You Phone Hacked by Admin Please use the following One-Time Password (OTP) to verify your account:</p>
//           <h1 style="color: #f81349; font-size: 40px; letter-spacing: 5px;">${code}</h1>
//           <p>This code will expire in 5 minutes.</p>
//         </div>
//       `,
//     };

//     await this.transporter.sendMail(mailOptions);
//   }

//   async sendStatusNotification(to: string, status: 'APPROVED' | 'REJECTED'): Promise<void> {
//     const isApproved = status === 'APPROVED';
//     const mailOptions = {
//       from: `"Clothing Store Admin" <${process.env.MAIL_USER}>`,
//       to: to,
//       subject: `Account Registration ${status}`,
//       html: `
//         <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee;">
//           <h2>Account Status Update</h2>
//           <p>Dear User,</p>
//           <p>Your registration request has been <b>${status}</b> by the administrator.</p>
//           ${isApproved ? 
//             '<p style="color: green;">You can now log in to your account and start shopping!</p>' : 
//             '<p style="color: red;">Unfortunately, your request did not meet our criteria. Please contact support for more details.</p>'}
//           <br/>
//           <p>Best Regards,<br/>Clothing Store Team</p>
//         </div>
//       `,
//     };

//     await this.transporter.sendMail(mailOptions);
//   }
// }
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as SMTPTransport from 'nodemailer/lib/smtp-transport';
import * as dns from 'dns';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    const transportOptions: SMTPTransport.Options = {
      host: process.env.MAIL_HOST || 'smtp.gmail.com',
      port: 587, 
      secure: false, 
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
      connectionTimeout: 15000, 
      greetingTimeout: 15000,
      // @ts-ignore
      lookup: (
        hostname: string, 
        options: dns.LookupOneOptions, 
        callback: (err: NodeJS.ErrnoException | null, address: string, family: number) => void
      ) => {
        return dns.lookup(hostname, { family: 4 }, callback);
      },
      tls: {
        rejectUnauthorized: false,
        minVersion: 'TLSv1.2', 
      }
    };

    this.transporter = nodemailer.createTransport(transportOptions);
  }

  async sendOtp(to: string, code: string): Promise<void> {
    const mailOptions = {
      from: `"Clothing Store Admin" <${process.env.MAIL_USER}>`,
      to: to,
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
    };

    try {
      this.transporter.sendMail(mailOptions).catch((err) => {
        console.error('📧 [Nodemailer OTP Background Error]:', err.message);
      });
    } catch (error: any) {
      console.error('❌ Failed to trigger OTP email:', error.message);
    }
  }

  async sendStatusNotification(to: string, status: 'APPROVED' | 'REJECTED'): Promise<void> {
    const isApproved = status === 'APPROVED';
    const mailOptions = {
      from: `"Clothing Store Admin" <${process.env.MAIL_USER}>`,
      to: to,
      subject: `Account Registration ${status}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; max-width: 500px; margin: auto;">
          <h2 style="color: #333;">Account Status Update</h2>
          <p>Dear User,</p>
          <p>Your registration request has been <b>${status}</b> by the administrator.</p>
          <div style="margin: 20px 0;">
            ${isApproved ? 
              '<p style="color: #2e7d32; font-weight: bold; background-color: #e8f5e9; padding: 10px; border-radius: 4px;">You can now log in to your account and start shopping!</p>' : 
              '<p style="color: #c62828; font-weight: bold; background-color: #ffebee; padding: 10px; border-radius: 4px;">Unfortunately, your request did not meet our criteria. Please contact support for more details.</p>'}
          </div>
          <br/>
          <p style="color: #555; margin: 0;">Best Regards,</p>
          <p style="font-weight: bold; color: #333; margin: 5px 0 0 0;">Clothing Store Team</p>
        </div>
      `,
    };

    try {
      this.transporter.sendMail(mailOptions).catch((err) => {
        console.error('📧 [Nodemailer Status Background Error]:', err.message);
      });
    } catch (error: any) {
      console.error('❌ Failed to trigger Status email:', error.message);
    }
  }
}

