import nodemailer, { createTransport } from "nodemailer";

export const sentEmail = async (email, username, message ,update=false ) => {
  try {
    const subject = "Yocial Email Verification";
    const transporter = createTransport({
      host: process.env.HOST,
      port: process.env.EMAIL_PORT,
      secure: false,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS,
      },
    });

    const verificationMessage = update
    ? "Use The Below Link To Update Your Email in Yocial"
    : "Use The Below Link To Verify Your Email In Yocial";

  const template = `<!DOCTYPE html>
              <html lang="en">
              <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Yocial Email Verification</title>
              </head>
              <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
                <div style="background-color: #ffffff; max-width: 600px; margin: 0 auto; padding: 20px; border-radius: 5px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);">
                  <h2 style="color: #333; text-align: center;">Yocial Email Verification</h2>
                  <p>Hello ${username},</p>
                  <p>${verificationMessage}</p>
                  <p style="text-align: center; font-size: 24px;"><a href=${message} >Click here to verify</a> </p>
                  <p>If you did not request this code, please ignore this message. This link is valid for 30 minutes.</p>
                  <p>Thank you for using Yocial.</p>
                  <p style="text-align: center;">Best regards,<br>Team Yocial</p>
                </div>
              </body>
              </html>`;

    const info = await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: subject,
      text: "",
      html: template,
    });

    return { status: 200, message: "Email sent successfully", data: info };
  } catch (error) {
    console.error("Error in sentEmail:", error);
    return { status: 500, message: "Internal Server Error", error: error };
  }
};

export const sentVerificationEmail = async (email, username, link) => {
  return new Promise(async (resolve, reject) => {
    try {
      const subject = "Yocial Email Verification";
      const transporter = createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: process.env.EMAIL,
          pass: process.env.PASS,
        },
      });
      const template = `<!DOCTYPE html>
                <html lang="en">
                <head>
                  <meta charset="UTF-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <title>Yocial Email Verification</title>
                </head>
                <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
                  <div style="background-color: #ffffff; max-width: 600px; margin: 0 auto; padding: 20px; border-radius: 5px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);">
                  <h2 style="color: #333; text-align: center;">Yocial Email Verification</h2>
                    <p>Hello ${username},</p>
                    <p>You have requested to change password for the Yocial. Please click the following link and verify user to complete the process:</p>
                    <p style="text-align: center; font-size: 24px;"><a href=${link} >Click here to verify</a> </p>
                    <p>If you did not request this code, please ignore this message. This link is valid for 30 minutes.</p>
                    <p>Thank you for using Yocial.</p>
                    <p style="text-align: center;">Best regards,<br>Team Yocial</p>
                  </div>
                </body>
                </html>`;

      const info = await transporter.sendMail({
        from: process.env.EMAIL,
        to: email,
        subject: subject,
        text: "",
        html: template,
      });
      resolve(info);
    } catch (error) {
      reject(error);
    }
  });
};
