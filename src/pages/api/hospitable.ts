import axios from 'axios';

const hospitableApi = axios.create({
  baseURL: 'https://connect.hospitable.com/api/v1',
  headers: {
    'Authorization': `Bearer ${process.env.HOSPITABLE_API_KEY}`,
    'Content-Type': 'application/json',
  },
});

export async function updateHospitableCalendar(listingId: string, dates: Array<{ date: string, availability: { available: boolean } }>) {
  try {
    const response = await hospitableApi.post(`/listings/${listingId}/calendar`, { dates });
    return response.data;
  } catch (error) {
    console.error('Error updating Hospitable calendar:', error);
    throw error;
  }
}