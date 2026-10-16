
const express = require("express");
const axios = require("axios");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();
const PORT = 3001;

app.get("/api/weather", async (req, res) => {
  const city = req.query.city;

  if (!city || !city.trim()) {
    return res.status(400).json({ error: "Add meg a város nevét!" });
  }

  if (!process.env.OPENWEATHER_API_KEY) {
    return res.status(500).json({
      error: "Hiányzik az OpenWeather API-kulcs a .env fájlból.",
    });
  }

  try {
    const response = await axios.get(
      "https://api.openweathermap.org/data/2.5/weather",
      {
        params: {
          q: city.trim(),
          appid: process.env.OPENWEATHER_API_KEY,
          units: "metric",
          lang: "hu",
        },
      },
    );

    res.json(response.data);
  } catch (error) {
    const status = error.response?.status;

    if (status === 404) {
      return res.status(404).json({ error: "Nem található ilyen város." });
    }

    if (status === 401) {
      return res.status(502).json({
        error: "Az időjárási API-kulcs érvénytelen vagy még nem aktív.",
      });
    }

    console.error("Weather API error:", status || error.message);
    res.status(502).json({ error: "Nem sikerült lekérni az időjárást." });
  }
});

app.listen(PORT, () => {
  console.log(`Weather API fut: http://localhost:${PORT}`);
});
