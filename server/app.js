const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const voiceRoute = require('./routes/voiceRoute');

dotenv.config();
// console.log("🔑 Loaded API key:", process.env.GEMINI_API_KEY?.slice(0, 8));
const app = express();
app.use(cors());
app.use(express.json());

app.use('/voice-command', voiceRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
