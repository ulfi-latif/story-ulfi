import CONFIG from '../utils/config';

const ENDPOINTS = {
  STORIES: `${CONFIG.BASE_URL}/stories`,
};

export async function getData() {
  const fetchResponse = await fetch(ENDPOINTS.STORIES, {
    headers: {
      Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1c2VyLWVBNGpCdWl5X090bFg3dlciLCJpYXQiOjE3NDcyMzI2NDJ9.mKOslT1Uy9sxEty6Qhd1DbH0iGzRSs3HA7k0Igti9I4`,
    },
  });

  if (!fetchResponse.ok) {
    throw new Error('Gagal mengambil data');
  }

  return await fetchResponse.json();
}
