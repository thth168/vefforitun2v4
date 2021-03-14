export async function fetchEarthquakes(type = '4.5', period = 'hour') {
  // TODO sækja gögn frá proxy þjónustu
  let result;
  const url = new URL(`${window.location.hostname}/proxy?period=${period}&type=${type}`);

  try {
    result = await fetch(url.href);
  } catch (e) {
    console.error('Villa við að sækja', e);
    return null;
  }

  if (!result.ok) {
    console.error('Ekki 200 svar', await result.text());
    return null;
  }

  const earthquakes = await result.json();
  return earthquakes;
}
