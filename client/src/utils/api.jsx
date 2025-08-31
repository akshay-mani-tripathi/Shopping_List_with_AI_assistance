import axios from 'axios';

// Automatically uses the environment variable
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const sendVoiceCommand = async (text) => {
  const res = await axios.post(`${BACKEND_URL}/voice-command`, { text });
  return res.data;
};
