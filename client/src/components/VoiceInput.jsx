import React, { useState, useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import axios from 'axios';

// -----------------------------
// Backend URL from environment variable
// -----------------------------
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

const VoiceInput = ({ onResult }) => {
  const { transcript, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();
  const [micActive, setMicActive] = useState(false);

  // -----------------------------
  // Option D: Browser support check
  // -----------------------------
  useEffect(() => {
    if (!browserSupportsSpeechRecognition) {
      alert("⚠️ Your browser doesn't support Speech Recognition. Please use Chrome or Edge.");
    }
  }, [browserSupportsSpeechRecognition]);

  // -----------------------------
  // Start listening
  // -----------------------------
  const handleListen = async () => {
    try {
      // Explicitly request microphone permission
      await navigator.mediaDevices.getUserMedia({ audio: true });
      setMicActive(true);
      resetTranscript();

      SpeechRecognition.startListening({
        continuous: false,
        language: 'en-IN'
      });

      // Optional: stop automatically after 7 seconds
      setTimeout(() => handleStop(), 7000);
    } catch (err) {
      alert("⚠️ Microphone access denied!");
      console.error(err);
    }
  };

  // -----------------------------
  // Stop listening
  // -----------------------------
  const handleStop = () => {
    SpeechRecognition.stopListening();
    setMicActive(false);
  };

  // -----------------------------
  // Send transcript to backend
  // -----------------------------
  useEffect(() => {
    if (transcript && !micActive) {
      handleSend();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [micActive]);

  const handleSend = async () => {
    try {
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
      <button
        onClick={handleListen}
        className="mic-button"
        disabled={micActive}
      >
        {micActive ? '🎤 Listening...' : '🎙️ Speak'}
      </button>

      {micActive && (
        <button onClick={handleStop} className="mic-button" style={{ marginLeft: '10px' }}>
          🛑 Stop
        </button>
      )}

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
