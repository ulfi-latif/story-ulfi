export async function postStory({ token, description, photo, lat, lon }) {
  const formData = new FormData();
  formData.append('description', description);
  formData.append('photo', photo);

  if (lat !== null && lon !== null) {
    formData.append('lat', lat);
    formData.append('lon', lon);
  }

  const cleanToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;

  const response = await fetch('https://story-api.dicoding.dev/v1/stories', {
    method: 'POST',
    headers: {
      Authorization: cleanToken,
    },
    body: formData,
  });

  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.message || 'Gagal mengirim cerita');
  }

  return result;
}
