const express = require("express");
const cors = require("cors");
require("dotenv").config();
require("./database"); // MongoDB connection
const Product = require("./models/product");
const scrapeKhaadi = require("./scraper");

const app = express();
app.use(express.json());
app.use(cors());

// ✅ Default route
app.get("/", (req, res) => {
  res.send("Khaadi Agent Backend is Running!");
});

// ✅ Fetch price from Khaadi
app.post("/scrape", async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: "URL is required" });

  try {
    const price = await scrapeKhaadi(url);
    if (!price) return res.status(400).json({ error: "Failed to fetch price" });

    res.json({ price });
  } catch (error) {
    console.error("❌ Error in scraping:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Save a product for tracking
app.post("/track", async (req, res) => {
  const { url, targetPrice, email, currentPrice } = req.body;

  if (!url || !targetPrice || !email || !currentPrice) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const newTracking = new Product({ url, targetPrice, email, currentPrice });
    await newTracking.save();
    console.log(`✅ Tracking saved for ${url}`);
    res.json({ message: "Tracking saved successfully!" });
  } catch (error) {
    console.error("❌ Error saving tracking:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Fetch all tracked products
app.get("/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error("❌ Error fetching products:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Start cron job for price checking
require("./cron");

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
