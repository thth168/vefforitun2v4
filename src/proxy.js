// TODO útfæra proxy virkni
import express from 'express';
import fetch from 'node-fetch';
import { get, set } from './cache.js';
import { timerStart, timerEnd } from './time.js';

export const router = express.Router();

async function fetchEarthquakes(type, period) {
  const url = `https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/${type}_${period}.geojson`;
  try {
    const earthquakes = await fetch(url);
    return await earthquakes.json();
  } catch (e) {
    console.error(`Mistókst að sækja gögn af USGS: ${e}`);
    return null;
  }
}

router.get('/', async (req, res) => {
  const start = timerStart();
  let cached = true;
  const {
    period = 'month',
    type = '4.5',
  } = req.query;

  let data = null;
  data = await get(`period:${period}+type:${type}`);
  if (!data) {
    await fetchEarthquakes(type, period)
      .then((earthquakes) => { data = earthquakes; return earthquakes; });
    cached = false;
  }
  await set(`period:${period}+type:${type}`, data);
  res.json({
    data,
    info: {
      cached,
      elapsed: timerEnd(start),
    },
  });
});
