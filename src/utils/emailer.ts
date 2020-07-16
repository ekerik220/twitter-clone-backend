import nodemailer from "nodemailer";
import { environment } from "../environment";

/**
 * Sends out an email containing a confirmation code.
 * @param {string} sendTo - Email address to send to.
 * @param {string} confirmationCode - 6 digit confirmation code
 */
export const sendConfirmationCodeEmail = async (
  sendTo: string,
  confirmationCode: string
) => {
  // html body for the email
  const body = `
        <div style="background: rgb(245, 248, 250); width: 100%; height: 100%; padding-bottom: 30px;">
          <div style="background: white; width: 450px; margin: 0 auto; padding: 30px; font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
            <div>
              <a href="${environment.homepage}" target="_blank" style="margin-left:90%">
                <img alt="Twatter" width="32px" src="https://ci5.googleusercontent.com/proxy/ObVgYJQgSjo41l1NQLa34y0cx059F8lNASu5OoCyxyuCxcV7dd5weiertHgR-sX4Sez9dT6iROiAH7iNxp3aDP98pJwyMQJY15cXJDykaOqgncPl=s0-d-e1-ft#https://ea.twimg.com/email/self_serve/media/icon_twitter_blue.png" />
              </a>
            </div>
            <div style="font-size:16px; line-height:22px;">
              <h2 style="font-size:24px;font-weight:bold;line-height:32px;">
                Confirm your email address
              </h2>
              <p>
                There’s one quick step you need to complete before creating your Twatter account. Let’s make sure this is the right email address for you — please confirm this is the right address to use for your new account.
              </p>
              <p>
                Please enter this verification code to get started on Twatter:<br><span style="font-size:32px;font-weight:bold;line-height:36px;">${confirmationCode}</span><br><span style="font-size:14px;">
              Verification codes expire after two hours.
              </span>
              </p>
              <p>
                Thanks,<br>Twatter
              </p>
            </div>
          </div>
        </div>
`;

  // set up a transporter (sender)
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: environment.email.username,
      pass: environment.email.password,
    },
  });

  // set up the email to send
  const mailOptions = {
    from: environment.email.username,
    to: sendTo,
    subject: `${confirmationCode} is your Twatter verification code`,
    html: body,
  };

  // send the email
  transporter.sendMail(mailOptions, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Email sent!");
    }
  });
};
