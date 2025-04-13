const axios = require("axios");
const cheerio = require("cheerio");

async function scrapeKhaadi(url) {
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    // Extract Sale Price
    const salePriceText = $("span.sales.reduced-price span.value.cc-price").text().trim();
    const salePrice = salePriceText ? parseFloat(salePriceText.replace("PKR ", "").replace(",", "")) : null;

    // Extract Actual Price (if no sale price available)
    const actualPriceText = $("span.value.cc-price").text().trim();
    const actualPrice = actualPriceText ? parseFloat(actualPriceText.replace("PKR ", "").replace(",", "")) : null;

    // Final price: sale price if available, otherwise actual price
    const finalPrice = salePrice || actualPrice;

    console.log(`🔍 Scraped price for ${url}: PKR ${finalPrice}`);
    return finalPrice;
  } catch (error) {
    console.error("❌ Scraping error:", error.message);
    return null;
  }
}

module.exports = scrapeKhaadi;
