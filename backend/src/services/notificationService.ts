import nodemailer from 'nodemailer';
import twilio from 'twilio';
import { config } from '../config';
import { Notification, NotificationChannel, NotificationType, IOrder, IUser } from '../models';

class NotificationService {
  private emailTransporter: nodemailer.Transporter | null = null;
  private twilioClient: twilio.Twilio | null = null;

  constructor() {
    this.initEmail();
    this.initTwilio();
  }

  private initEmail() {
    if (config.email.host && config.email.user) {
      this.emailTransporter = nodemailer.createTransport({
        host: config.email.host,
        port: config.email.port,
        secure: config.email.secure,
        auth: {
          user: config.email.user,
          pass: config.email.pass,
        },
      });
      console.log('📧 Email notification transporter configured.');
    } else {
      console.log('ℹ️ Email credentials not provided — email notifications will run in simulation/log mode.');
    }
  }

  private initTwilio() {
    if (config.twilio.accountSid && config.twilio.authToken) {
      try {
        this.twilioClient = twilio(config.twilio.accountSid, config.twilio.authToken);
        console.log('📱 Twilio client configured for WhatsApp/SMS.');
      } catch (err) {
        console.error('Failed to init Twilio client:', err);
      }
    } else {
      console.log('ℹ️ Twilio credentials not provided — WhatsApp/SMS will run in simulation/log mode.');
    }
  }

  public async send({
    channel,
    type,
    title,
    message,
    recipientEmail,
    recipientPhone,
    recipientUser,
    metadata,
  }: {
    channel: NotificationChannel;
    type: NotificationType;
    title: string;
    message: string;
    recipientEmail?: string;
    recipientPhone?: string;
    recipientUser?: any;
    metadata?: Record<string, unknown>;
  }): Promise<void> {
    const notification = new Notification({
      channel,
      type,
      title,
      message,
      recipientEmail,
      recipientPhone,
      recipientUser,
      metadata,
      status: 'PENDING',
    });

    try {
      if (channel === 'EMAIL' && recipientEmail) {
        if (this.emailTransporter) {
          await this.emailTransporter.sendMail({
            from: `"${config.email.fromName}" <${config.email.fromEmail}>`,
            to: recipientEmail,
            subject: title,
            html: `<div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                    <h2 style="color: #ea580c;">${title}</h2>
                    <p style="font-size: 16px;">${message}</p>
                    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
                    <p style="font-size: 12px; color: #888;">PSN Farm Pure Mango & Papaya Store</p>
                   </div>`,
          });
        } else {
          console.log(`[SIMULATED EMAIL] To: ${recipientEmail} | Subject: ${title} | Body: ${message}`);
        }
      } else if (channel === 'WHATSAPP' && recipientPhone) {
        const formattedPhone = recipientPhone.startsWith('+') ? recipientPhone : `+91${recipientPhone}`;
        if (this.twilioClient && config.twilio.whatsappNumber) {
          await this.twilioClient.messages.create({
            body: `🥭 *${title}*\n\n${message}`,
            from: config.twilio.whatsappNumber,
            to: `whatsapp:${formattedPhone}`,
          });
        } else {
          console.log(`[SIMULATED WHATSAPP] To: whatsapp:${formattedPhone} | Message: ${title} - ${message}`);
        }
      } else if (channel === 'SMS' && recipientPhone) {
        const formattedPhone = recipientPhone.startsWith('+') ? recipientPhone : `+91${recipientPhone}`;
        if (this.twilioClient && config.twilio.smsNumber) {
          await this.twilioClient.messages.create({
            body: `${title}: ${message}`,
            from: config.twilio.smsNumber,
            to: formattedPhone,
          });
        } else {
          console.log(`[SIMULATED SMS] To: ${formattedPhone} | Message: ${title} - ${message}`);
        }
      }

      notification.status = 'SENT';
      notification.sentAt = new Date();
    } catch (err: any) {
      console.error(`❌ Failed to send ${channel} notification:`, err?.message || err);
      notification.status = 'FAILED';
      notification.error = err?.message || 'Unknown error';
    } finally {
      await notification.save();
    }
  }

  public async notifyOrderStatusChange(order: IOrder, user: IUser, statusMessage: string): Promise<void> {
    const title = `Order Update: #${order.orderId} is ${order.orderStatus.replace(/_/g, ' ')}`;
    const message = `Hello ${user.name || 'Valued Customer'}, ${statusMessage} (Order ID: ${order.orderId}, Total: ₹${order.totalAmount})`;

    // Send Email
    if (user.email) {
      await this.send({
        channel: 'EMAIL',
        type: `ORDER_${order.orderStatus}` as NotificationType,
        title,
        message,
        recipientEmail: user.email,
        recipientUser: user._id,
        metadata: { orderId: order.orderId, status: order.orderStatus },
      });
    }

    // Send WhatsApp if phone present
    const phone = user.phone || order.shippingAddress?.phone;
    if (phone) {
      await this.send({
        channel: 'WHATSAPP',
        type: `ORDER_${order.orderStatus}` as NotificationType,
        title,
        message,
        recipientPhone: phone,
        recipientUser: user._id,
        metadata: { orderId: order.orderId, status: order.orderStatus },
      });
    }
  }
}

export const notificationService = new NotificationService();
