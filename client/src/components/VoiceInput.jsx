import React, { useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import axios from 'axios';

/**
 * VoiceInput Component
 * --------------------
 * Handles voice input using Web Speech API and sends recognized text
 * to the backend server. Automatically triggers on speech end.
 *
 * Props:
 *  - onResult: callback function to handle server response
 */

// -----------------------------
// Backend URL from environment variable
// -----------------------------
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

const VoiceInput = ({ onResult }) => {
  const { transcript, resetTranscript, listening, browserSupportsSpeechRecognition } = useSpeechRecognition();

  useEffect(() => {
    if (!browserSupportsSpeechRecognition) {
      alert("⚠️ Your browser doesn't support Speech Recognition.");
    }
  }, [browserSupportsSpeechRecognition]);

  // Automatically send transcript when speech ends
  useEffect(() => {
    if (!listening && transcript) {
      handleSend();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listening]);

  // Start listening
  const handleListen = () => {
    resetTranscript();
    SpeechRecognition.startListening({
      continuous: false,
      language: 'en-IN'
    });
  };

  // Send transcript to backend
  const handleSend = async () => {
    try {
      const res = await axios.post(`${BACKEND_URL}/voice-command`, { text: transcript });
      onResult(res.data);
    } catch (err) {
      console.error('❌ Failed to send to server:', err);
    } finally {
      resetTranscript();
    }
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <button onClick={handleListen} className="mic-button">
        {listening ? '🎤 Listening...' : '🎙️ Speak'}
      </button>

      {transcript && (
        <p style={{ marginTop: '10px', fontStyle: 'italic' }}>
          🗣️ You said: <strong>{transcript}</strong>
        </p>
      )}
    </div>
  );
};

export default VoiceInput;
