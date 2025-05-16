import { postStory } from '../../data/post-story.js';


const AddPage = {
  async render() {
    return `
      <section class="add-story">
        <h2>Tambah Cerita</h2>
        <form id="add-story-form">

          <label for="story-desc">Deskripsi:</label>
          <textarea id="story-desc" name="description" required></textarea>

          <label for="story-photo">Foto: <span class="sr-only">(ambil atau unggah gambar)</span></label>
      <input
  type="file"
  id="story-photo"
  name="photo"
  accept="image/*"
  capture="environment"
  required
 />
          <video id="video" width="320" height="240" autoplay style="display:none;"></video>
          <button type="button" id="start-camera">Mulai Kamera</button>
          <button type="button" id="capture-photo" style="display:none;"aria-label="Ambil Foto">Ambil Foto</button>
          <canvas id="canvas" width="320" height="240" style="display:none;"></canvas>

          <button type="submit">Kirim</button>
        </form>
        <!-- Tambahkan peta dan info lokasi di bawah form -->
      <div id="map" style="height: 300px; margin-top: 20px;"></div>
      <p id="map-info">Klik pada peta untuk menentukan lokasi cerita.</p>
      </section>
    `;
  },

   async afterRender() {
    const form = document.getElementById('add-story-form');
    const video = document.getElementById('video');
    const startCameraBtn = document.getElementById('start-camera');
    const captureBtn = document.getElementById('capture-photo');
    const canvas = document.getElementById('canvas');
    let stream;

    startCameraBtn.addEventListener('click', async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
        video.style.display = 'block';
        startCameraBtn.style.display = 'none';
        captureBtn.style.display = 'inline-block';
      } catch (error) {
        alert('Gagal mengakses kamera: ' + error.message);
      }
    });

    captureBtn.addEventListener('click', () => {
      const context = canvas.getContext('2d');
      canvas.style.display = 'block';
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      video.style.display = 'none';
      captureBtn.style.display = 'none';

      canvas.toBlob((blob) => {
        // Buat file baru dari foto hasil capture
        const file = new File([blob], 'captured-photo.png', { type: 'image/png' });
        // Pasang file ini di input file supaya bisa dikirim ke postStory
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        form.querySelector('input[type="file"]').files = dataTransfer.files;
      }, 'image/png');
      
      // Hentikan stream kamera supaya kamera mati
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    });



     let lat = null;
  let lon = null;

  const interval = setInterval(() => {
    if (typeof L !== 'undefined') {
      clearInterval(interval);

      const map = L.map('map').setView([-7.8, 110.4], 7); // Posisi awal Yogyakarta

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
      }).addTo(map);

      let marker;

      map.on('click', function (e) {
        lat = e.latlng.lat;
        lon = e.latlng.lng;

        if (marker) {
          map.removeLayer(marker);
        }
        marker = L.marker([lat, lon]).addTo(map);
        document.getElementById('map-info').textContent = `Lokasi dipilih: ${lat.toFixed(4)}, ${lon.toFixed(4)}`;
      });
    }
  }, 100);


    form.addEventListener('submit', async (e) => {
      e.preventDefault();


      const description = form.description.value;
      const photo = form.querySelector('input[type="file"]').files[0];
      const token = localStorage.getItem('token');

      if (!token) {
        alert('Anda harus login terlebih dahulu.');
        return;
      }

      if (!lat || !lon) {
      alert('Silakan pilih lokasi di peta terlebih dahulu.');
      return;
    }

      try {
    await postStory({ token, description, photo, lat, lon }); // Tambahkan lat lon
    alert('Cerita berhasil dikirim!');
    form.reset();
    video.style.display = 'none';
    canvas.style.display = 'none';
    startCameraBtn.style.display = 'inline-block';
    captureBtn.style.display = 'none';
    document.getElementById('map-info').textContent = 'Klik pada peta untuk menentukan lokasi cerita.';
    } catch (error) {
    alert(`Gagal mengirim cerita: ${error.message}`);
  }
    });
  },
};

export default AddPage;
