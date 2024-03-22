const express = require("express");
const app = express();
require("dotenv").config();

const port = process.env.PORT || 3000;

const sdk = require("api")("@opensea/v2.0#1osfegltxkl2kk");
sdk.auth(process.env.API_KEY);
sdk.server("https://api.opensea.io");

let cachedData = null;
let lastFetchTime = null;

const fetchData = async () => {
  try {
    let temp = {}

    const { data } = await sdk.get_collection_stats({
      collection_slug: "wearetheoutkast",
    });

    var data2 = await sdk.get_collection({
      collection_slug: "wearetheoutkast",
    });

    data2 = data2.data;
    
    temp = {
      ...data,
      ...data2
    }

    cachedData = temp;
    lastFetchTime = Date.now();
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

const getData = async (req, res) => {
  const oneHour = 60 * 60 * 1000;
  if (!cachedData || !lastFetchTime || Date.now() - lastFetchTime > oneHour) {
    await fetchData();
  }
  res.json(cachedData);
};

app.get("/api/data", getData);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
