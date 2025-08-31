import axios from 'axios';

export const sendVoiceCommand = async (text) => {
  const res = await axios.post('https://shopping-list-with-ai-assistance.onrender.com/voice-command', { text });
  return res.data;
};
