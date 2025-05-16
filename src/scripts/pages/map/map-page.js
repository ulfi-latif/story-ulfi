import { getData } from '../../data/api.js';

const MapPage = {
  async render() {
    return `
      <section class="map-page">
        <h2>Map Cerita</h2>
        <div id="map" style="height: 500px;"></div>
      </section>
    `;
  },

  async afterRender() {
    // Pastikan Leaflet sudah loaded
    const L = window.L;

    const map = L.map('map').setView([-6.200000, 106.816666], 13); // contoh: Jakarta

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    try {
      const result = await getData();
      const stories = result.listStory;

      stories.forEach(story => {
        if (story.lat && story.lon) {
          const marker = L.marker([story.lat, story.lon]).addTo(map);
          marker.bindPopup(`<b>${story.name}</b><br>${story.description}`);
        }
      });
    } catch (error) {
      alert('Gagal memuat data cerita untuk peta: ' + error.message);
    }
  }
};

export default MapPage;
