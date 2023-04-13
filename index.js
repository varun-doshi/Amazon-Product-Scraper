const axios = require("axios");
const cheerio = require("cheerio");
require("dotenv").config();
const productSID = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(productSID, authToken);

const express = require("express");
const PORT = 8000;

const product = { name: "", price: "", link: "" };

const url =
  "https://www.amazon.in/Acer-1920x1080-Monitor-Refresh-Features/dp/B0BXP3CP9K/ref=sr_1_7?crid=2GIB9FCLLR6YG&keywords=monitor&qid=1680155101&sprefix=monito%2Caps%2C274&sr=8-7";
async function scrape() {
  const { data } = await axios.get(url);
  // console.log(data);
  const $ = cheerio.load(data);
  const item = $("div#dp");
  product.name = $(item).find("h1 span#productTitle").text();
  product.link = url;
  const price = $(item)
    .find("span .a-price-whole")
    .first()
    .text()
    .replace(/[,.]/g, "");

  const priceNum = parseInt(price);
  product.price = priceNum;
  console.log(product);

  if (priceNum < 9000) {
    client.messages
      .create({
        body: `THe price of ${product.name} is ${product.price}. Purchase at ${product.link}`,
        from: "+xxxxxxxxxxx",
        to: "+xxxxxxxxxxxx",
      })
      .then((message) => {
        console.log(message.to);
        clearInterval(handle);
      });
  }
}

const handle = setInterval(scrape, 60000);
