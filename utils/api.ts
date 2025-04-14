// utils/api.ts
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const username = 'OpexArga'; // Ganti dengan Epicor user
const password = 'Nilam172459'; // Ganti dengan Epicor pass
const apiKey = 'hljv06FjJZMcphWg6nm3x76FJGnoQNpUXmPdoJgRCpeel'; // Ganti dengan API Key Epicor

const basicAuth = 'Basic ' + btoa(`${username}:${password}`);

const api = axios.create({
  baseURL: 'https://epicortest01.opexcg.com/epicor00/api/v2/odata/EPIC06',
  headers: {
    Authorization: basicAuth,
    'x-api-key': apiKey,
    'Content-Type': 'application/json',
  },
});

export default api;
