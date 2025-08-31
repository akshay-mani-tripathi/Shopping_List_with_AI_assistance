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

  // -----------------------------
  // Option D: Check browser support
  // -----------------------------
  useEffect(() => {
    if (!browserSupportsSpeechRecognition) {
      alert("⚠️ Your browser doesn't support Speech Recognition. Please use Chrome or Edge.");
    }
  }, [browserSupportsSpeechRecognition]);

  // -----------------------------
  // Option B: Debug when trying to start listening
  // -----------------------------
  const handleListen = () => {
    console.log("🎤 Attempting to start listening...");
    resetTranscript();

    SpeechRecognition.startListening({
      continuous: false, // Stop automatically after user stops speaking
      language: 'en-IN'  // Indian English
    });
  };

  // -----------------------------
  // Automatically send transcript when speech ends
  // -----------------------------
  useEffect(() => {
    if (!listening && transcript) {
      handleSend();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listening]);

  // -----------------------------
  // Send transcript to backend
  // -----------------------------
  const handleSend = async () => {
    try {
      // Option C: Check microphone permissions (browser will prompt automatically)
      console.log("📡 Sending transcript to backend:", transcript);

      const res = await axios.post(`${BACKEND_URL}/voice-command`, { text: transcript });
      onResult(res.data);
    } catch (err) {
      console.error('❌ Failed to send to server:', err);
      alert("⚠️ Failed to send voice command. Check console for details.");
    } finally {
      resetTranscript();
    }
  };

  // -----------------------------
  // JSX
  // -----------------------------
  return (
    <div style={{ textAlign: 'center' }}>
      <button onMouseDown={handleListen} className="mic-button">
        {listening ? '🎤 Listening...' : '🎙️ Speak'}
      </button>

      <p style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
        🔊 Please allow microphone access if prompted
      </p>

      {transcript && (
        <p style={{ marginTop: '10px', fontStyle: 'italic' }}>
          🗣️ You said: <strong>{transcript}</strong>
        </p>
      )}
    </div>
  );
};

export default VoiceInput;
