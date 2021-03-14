import { fetchEarthquakes } from './lib/earthquakes';
import { el, element, formatDate } from './lib/utils';
import { init, createPopup } from './lib/map';

document.addEventListener('DOMContentLoaded', async () => {
  // TODO
  // Bæta við virkni til að sækja úr lista
  // Nota proxy
  // Hreinsa header og upplýsingar þegar ný gögn eru sótt
  // Sterkur leikur að refactora úr virkni fyrir event handler í sér fall
  const params = new URLSearchParams(window.location.search);
  const type = params.get('type');
  const period = params.get('period');
  const earthquakes = await fetchEarthquakes(type, period);
  const headerStrings = {
    hour: ', seinustu klukkustund',
    day: ', seinasta dag',
    week: ', seinustu viku',
    month: ', seinasta mánuð',
  };

  // Fjarlægjum loading skilaboð eftir að við höfum sótt gögn
  const loading = document.querySelector('.loading');
  const cache = document.querySelector('.cache');
  const parent = loading.parentNode;
  const earthQuakeType = document.querySelector(`a[href='/${window.location.search}']`);
  const header = document.querySelector('h1');
  parent.removeChild(loading);
  if (!earthquakes) {
    parent.appendChild(
      el('p', 'Villa við að sækja gögn'),
    );
  }

  const ul = document.querySelector('.earthquakes');
  const map = document.querySelector('.map');
  init(map);
  if (!earthquakes) return;
  const seconds = parseFloat(earthquakes.info.elapsed);

  cache.innerHTML = `Gögn eru ${earthquakes.info.cached ? '' : 'ekki'} í cache. Fyrirspurn tók ${seconds} sek.`;
  header.innerHTML = earthQuakeType.innerHTML + headerStrings[period];
  earthquakes.data.features.forEach((quake) => {
    const {
      title, mag, time, url,
    } = quake.properties;

    const link = element('a', { href: url, target: '_blank' }, null, 'Skoða nánar');

    const markerContent = el('div',
      el('h3', title),
      el('p', formatDate(time)),
      el('p', link));
    const marker = createPopup(quake.geometry, markerContent.outerHTML);

    const onClick = () => {
      marker.openPopup();
    };

    const li = el('li');

    li.appendChild(
      el('div',
        el('h2', title),
        el('dl',
          el('dt', 'Tími'),
          el('dd', formatDate(time)),
          el('dt', 'Styrkur'),
          el('dd', `${mag} á richter`),
          el('dt', 'Nánar'),
          el('dd', url.toString())),
        element('div', { class: 'buttons' }, null,
          element('button', null, { click: onClick }, 'Sjá á korti'),
          link)),
    );

    ul.appendChild(li);
  });
});
