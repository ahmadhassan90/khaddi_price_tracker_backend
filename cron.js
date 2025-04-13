const cron = require("node-cron");
const Product = require("./models/product");
const scrapeKhaadi = require("./scraper");
const sendEmail = require("./email");

console.log("🔄 Cron job initialized. Running every hour...");

cron.schedule("3 * * * *", async () => {
  console.log("⏳ Running Price Check...");

  try {
    const products = await Product.find();
    console.log(`📌 Checking ${products.length} products...`);

    for (let product of products) {
      const newPrice = await scrapeKhaadi(product.url);

      if (newPrice && newPrice <= product.targetPrice) {
        console.log(`📉 Price drop detected for ${product.url}! Sending email...`);

        await sendEmail(
          product.email,
          "🔥 EasyShop Price Drop Alert!",
          product.url,
          newPrice
        );

        // ✅ Remove product from database after email is sent
        await Product.deleteOne({ _id: product._id });
        console.log(`✅ Email sent to ${product.email}. Entry deleted from database.`);
      }
    }
  } catch (error) {
    console.error("❌ Error in cron job:", error);
  }
});
