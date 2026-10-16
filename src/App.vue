
<script setup>
import { ref } from 'vue'

const city = ref('')
const weather = ref(null)
const loading = ref(false)
const error = ref('')

async function searchWeather() {
  const cityName = city.value.trim()

  if (!cityName || loading.value) return

  loading.value = true
  error.value = ''
  weather.value = null

  try {
    const response = await fetch(
      `/api/weather?city=${encodeURIComponent(cityName)}`
    )

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Nem sikerült lekérni az időjárást.')
    }

    weather.value = data
  } catch (err) {
    error.value =
      err.message || 'Nem sikerült kapcsolódni a szerverhez.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <main class="page">
    <section class="weather-app">
      <div class="brand">
        <span class="weather-icon">☀️</span>
        <span>Weatherly</span>
      </div>

      <p class="eyebrow">IDŐJÁRÁSJELENTÉS</p>

      <h1>Az időjárás,<br />egy pillantásra.</h1>

      <p class="subtitle">
        Nézd meg, milyen idő vár rád a kedvenc városodban.
      </p>

      <form class="search" @submit.prevent="searchWeather">
        <span>⌕</span>

        <input
          v-model="city"
          placeholder="Melyik várost keresed?"
          aria-label="Város neve"
          :disabled="loading"
        />

        <button type="submit" :disabled="loading">
          {{ loading ? 'Keresés...' : 'Keresés ↗' }}
        </button>
      </form>

      <p v-if="error" class="error-message" role="alert">
        {{ error }}
      </p>

      <div v-if="loading" class="empty-state">
        <span class="big-sun">🌤️</span>
        <p>Időjárási adatok betöltése...</p>
      </div>

      <div v-else-if="weather" class="result">
        <img
          class="sun"
          :src="`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`"
          :alt="weather.weather[0].description"
          width="80"
          height="80"
        />

        <div class="weather-details">
          <h2>{{ weather.name }}, {{ weather.sys.country }}</h2>

          <p class="temperature">
            {{ Math.round(weather.main.temp) }} °C
          </p>

          <p class="description">
            {{ weather.weather[0].description }}
          </p>

          <div class="weather-stats">
            <div>
              <span>Hőérzet</span>
              <strong>{{ Math.round(weather.main.feels_like) }} °C</strong>
            </div>

            <div>
              <span>Páratartalom</span>
              <strong>{{ weather.main.humidity }}%</strong>
            </div>

            <div>
              <span>Szélsebesség</span>
              <strong>{{ weather.wind.speed }} m/s</strong>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="empty-state">
        <span class="big-sun">🌤️</span>
        <p>Kezdd egy város keresésével</p>
      </div>

      <footer>
        <span>VUE 3</span>
        <span>·</span>
        <span>WEATHER APP PROJECT</span>
      </footer>
    </section>
  </main>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Manrope:wght@400;500;600;700;800&display=swap');

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: 'DM Sans', sans-serif;
  color: #182a40;
}

button,
input {
  font: inherit;
}

.page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 32px 18px;
  background:
    radial-gradient(ellipse at 15% 15%, #e2f4ff 0, transparent 40%),
    radial-gradient(ellipse at 90% 85%, #e4f4e9 0, transparent 38%),
    #f6f8fb;
}

.weather-app {
  width: 100%;
  max-width: 680px;
  padding: 42px;
  border: 1px solid #e7edf2;
  border-radius: 28px;
  background: #ffffff;
  box-shadow: 0 24px 80px #263d5410;
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 800;
  font-size: 18px;
  font-family: 'Manrope', sans-serif;
}

.weather-icon {
  display: grid;
  place-items: center;
  width: 38px;
  height: 38px;
  border-radius: 13px;
  background: #fff5d9;
}

.eyebrow {
  margin: 52px 0 14px;
  color: #33856a;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 2.5px;
}

h1 {
  margin: 0;
  font-family: 'Manrope', sans-serif;
  font-size: clamp(34px, 6vw, 52px);
  line-height: 1.15;
  letter-spacing: -2px;
}

.subtitle {
  max-width: 440px;
  margin: 18px 0 28px;
  color: #7a8797;
  line-height: 1.8;
}

.search {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 7px;
  border: 1px solid #e5ebf0;
  border-radius: 15px;
  background: #fbfcfd;
}

.search > span {
  padding-left: 10px;
  color: #8493a3;
  font-size: 27px;
}

.search input {
  flex: 1;
  width: 0;
  min-width: 0;
  border: 0;
  outline: 0;
  background: transparent;
  color: #182a40;
  font-size: 14px;
}

.search input:disabled {
  opacity: 0.6;
}

.search button {
  padding: 13px 18px;
  border: 0;
  border-radius: 10px;
  background: #244f43;
  color: white;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.search button:hover {
  background: #326c59;
}

.search button:disabled {
  cursor: wait;
  opacity: 0.7;
}

.empty-state,
.result {
  display: flex;
  align-items: center;
  gap: 20px;
  min-height: 135px;
  margin-top: 25px;
  padding: 24px;
  border-radius: 18px;
  background: #f4f8f6;
}

.empty-state {
  justify-content: center;
  flex-direction: column;
  gap: 8px;
  color: #77877f;
  font-size: 13px;
}

.empty-state p {
  margin: 0;
}

.big-sun {
  font-size: 35px;
}

.sun {
  flex-shrink: 0;
  object-fit: contain;
}

.weather-details {
  flex: 1;
  min-width: 0;
}

.result h2 {
  margin: 0 0 6px;
  font-family: 'Manrope', sans-serif;
  font-size: 20px;
}

.temperature {
  margin: 8px 0 0;
  font-family: 'Manrope', sans-serif;
  font-size: 42px;
  font-weight: 800;
  letter-spacing: -1.5px;
}

.description {
  margin: 0 0 20px;
  color: #647568;
  text-transform: capitalize;
}

.weather-stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  padding-top: 16px;
  border-top: 1px solid #dfe9e2;
}

.weather-stats div {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.weather-stats span {
  color: #7a8797;
  font-size: 11px;
}

.weather-stats strong {
  font-size: 13px;
}

.error-message {
  margin: 16px 0 0;
  padding: 12px 15px;
  border: 1px solid #f2caca;
  border-radius: 12px;
  background: #fff3f3;
  color: #a52a2a;
  font-size: 13px;
  line-height: 1.5;
}

footer {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 32px;
  color: #9aa5af;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1.5px;
}

@media (max-width: 520px) {
  .weather-app {
    padding: 26px 20px;
  }

  .eyebrow {
    margin-top: 38px;
  }

  .search {
    flex-wrap: wrap;
  }

  .search input {
    flex: 1;
  }

  .search button {
    width: 100%;
  }

  .result {
    align-items: flex-start;
    gap: 10px;
    padding: 18px 12px;
  }

  .sun {
    width: 58px;
    height: 58px;
  }

  .temperature {
    font-size: 36px;
  }

  .weather-stats {
    gap: 8px;
  }

  .weather-stats span {
    font-size: 10px;
  }

  .weather-stats strong {
    font-size: 12px;
  }
}
</style>
