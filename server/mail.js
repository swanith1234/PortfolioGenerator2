import nodemailer from "nodemailer";
import { google } from "googleapis";
import dotenv from "dotenv";

dotenv.config(); // Ensure dotenv is properly loaded

const oAuth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URL
);
oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

const sendEmailSelect = async (email, name, url, repoUrl) => {
  try {
    // Get the access token
    const accessToken = await oAuth2Client.getAccessToken();

    let transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: "swanithpidugu@gmail.com",
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
        accessToken: accessToken, // Extract token from the response
      },
    });

    let mailOptions = {
      from: "swanithpidugu@gmail.com",
      to: email,
      subject: "Sending Email using Node.js",
      text: `Congratulations ${name}, your portfolio is successfully deployed at ${url} and you can download the zip file at ${repoUrl}All the best for your future endeavors!`,
    };

    const result = await transport.sendMail(mailOptions);
    console.log("Email sent successfully:", result);
    return result;
  } catch (error) {
    console.error("Error occurred while sending email:", error);
    throw error;
  }
};

export { sendEmailSelect };
