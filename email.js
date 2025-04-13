const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Sends a branded email with EasyShop styling and product details.
 */
async function sendEmail(to, subject, productUrl, newPrice) {
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd;">
      <h2 style="color: #ff6600;">🔥 Price Drop Alert from EasyShop!</h2>
      <p>Great news! The product you're tracking is now available at a lower price.</p>
      <h3>New Price: <strong style="color: green;">PKR ${newPrice}</strong></h3>
      <p>Click below to check the product:</p>
      <a href="${productUrl}" style="display: inline-block; background-color: #ff6600; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View Product</a>
      <p style="margin-top: 20px;">Thank you for using EasyShop Price Tracker!</p>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"EasyShop Alerts" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html: htmlContent,
    });

    console.log(`📧 Email sent to ${to} with product link: ${productUrl}`);
  } catch (error) {
    console.error(`❌ Failed to send email to ${to}:`, error);
  }
}

module.exports = sendEmail;
