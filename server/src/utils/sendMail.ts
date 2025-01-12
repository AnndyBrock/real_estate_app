import resend from "../config/resend";
import { NODE_ENV, EMAIL_SENDER } from "../constants/env";

type Params = {
    to: string;
    subject: string;
    text: string;
    html: string
}

const getFromEmail = () => NODE_ENV === "dev" ? "onboarding@resend.dev" : EMAIL_SENDER;

const getToEmail = (to: string) => NODE_ENV === "dev" ? "andrewtroyan@gmail.com" : to;

export const sendEmail = async ({ to, subject, text, html }: Params) => await resend.emails.send({
    from:getFromEmail(),
    to: getToEmail(to),
    subject,
    text,
    html
});
