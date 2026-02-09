import nodemailer from 'nodemailer'
import {appConfig} from '../appConfig'

export const emailAdapter = {
    sendEmail: async (email: string, subject: string, text: string) => {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: appConfig.email,
                pass: appConfig.emailPassword,
            },
        })

        const info = await transporter.sendMail({
            from: appConfig.email,
            to: email,
            subject,
            text,
        })

        return info
    },
}