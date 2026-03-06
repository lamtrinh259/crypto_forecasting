import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getCryptoData = async (symbol, period = '1y', interval = '1d') => {
  try {
    const response = await api.get('/crypto', {
      params: { symbol, period, interval }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching crypto data:', error);
    throw error;
  }
};

export const getCryptoPrediction = async (symbol, days = 30) => {
  try {
    const response = await api.get('/crypto/predict', {
      params: { symbol, days }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching prediction:', error);
    throw error;
  }
};

export const getSupportedSymbols = async () => {
  try {
    const response = await api.get('/crypto/symbols');
    return response.data;
  } catch (error) {
    console.error('Error fetching symbols:', error);
    throw error;
  }
};

export default api;
