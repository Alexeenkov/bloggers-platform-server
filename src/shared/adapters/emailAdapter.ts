import nodemailer from 'nodemailer'
import {appConfig} from '../appConfig'

export const emailAdapter = {
    sendEmail: async (email: string, subject: string, html: string) => {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: appConfig.email,
                pass: appConfig.emailPassword,
            },
        })

        const info = await transporter.sendMail({
            from: `"Bloggers Platform" <${appConfig.email}>`,
            to: email,
            subject,
            html,
        })

        return info
    },
}