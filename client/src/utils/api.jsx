import axios from 'axios';

export const sendVoiceCommand = async (text) => {
  const res = await axios.post('http://localhost:3000/voice-command', { text });
  return res.data;
};
