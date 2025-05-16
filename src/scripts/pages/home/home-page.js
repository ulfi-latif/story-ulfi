import { getData } from '../../data/api';

export default class HomePage {
  async render() {
    return `
      <section class="container">
        <h1>Home Page</h1>
        <div id="story-list">Loading...</div>
        <div id="map" style="height: 400px; margin-top: 20px;"></div>
      </section>
    `;
  }

  async afterRender() {
    const storyListElement = document.querySelector('#story-list');

    // Deklarasikan dulu supaya bisa diakses global di method ini
    let stories = [];

    try {
        const result = await getData();
        console.log(result);

        // Isi stories di sini
        stories = result.listStory;

        storyListElement.innerHTML = stories.map((story) => `
          <div class="story-card">
            <h3>${story.name}</h3>
            <p>${story.description}</p>
            <img src="${story.photoUrl}" alt="Foto cerita" />
            <p>Lokasi: ${story.lat}, ${story.lon}</p>
            <small>Diposting: ${new Date(story.createdAt).toLocaleString()}</small>
          </div>
        `).join('');
    } catch (error) {
        storyListElement.innerHTML = `<p style="color: red;">Gagal memuat data: ${error.message}</p>`;
    }

    // Tunggu sampai Leaflet siap
    const interval = setInterval(() => {
        if (typeof L !== 'undefined') {
            clearInterval(interval);

            const map = L.map('map').setView([-7.8, 110.4], 7);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors',
            }).addTo(map);

            // Tambahkan marker untuk setiap cerita
            stories.forEach((story) => {
                if (story.lat && story.lon) {
                    const marker = L.marker([story.lat, story.lon]).addTo(map);
                    marker.bindPopup(`
<b>${story.name}</b><br>
${story.description}<br>
<img src="${story.photoUrl}" alt="Foto ${story.name}" style="width: 100px;">
`);
                }
            });
        }
    }, 100);
}
}