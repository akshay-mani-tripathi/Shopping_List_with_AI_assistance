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
const VoiceInput = ({ onResult }) => {
  // -----------------------------
  // Speech recognition hooks
  // -----------------------------
  const { transcript, resetTranscript, listening, browserSupportsSpeechRecognition } = useSpeechRecognition();

  // -----------------------------
  // Check if browser supports speech recognition
  // -----------------------------
  useEffect(() => {
    if (!browserSupportsSpeechRecognition) {
      alert("⚠️ Your browser doesn't support Speech Recognition.");
    }
  }, [browserSupportsSpeechRecognition]);

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
  // Start listening to user speech
  // -----------------------------
  const handleListen = () => {
    resetTranscript(); // Clear previous transcript
    SpeechRecognition.startListening({
      continuous: false, // Stop after user stops speaking
      language: 'en-IN'  // Indian English
    });
  };

  // -----------------------------
  // Send transcript to server
  // -----------------------------
  const handleSend = async () => {
    try {
      const res = await axios.post('https://shopping-list-with-ai-assistance.onrender.com/voice-command', { text: transcript });
      onResult(res.data); // Pass server response to parent
    } catch (err) {
      console.error('❌ Failed to send to server:', err);
    } finally {
      resetTranscript(); // Clear transcript after sending
    }
  };

  // -----------------------------
  // JSX
  // -----------------------------
  return (
    <div style={{ textAlign: 'center' }}>
      {/* Microphone button */}
      <button onClick={handleListen} className="mic-button">
        {listening ? '🎤 Listening...' : '🎙️ Speak'}
      </button>

      {/* Display what user said */}
      {transcript && (
        <p style={{ marginTop: '10px', fontStyle: 'italic' }}>
          🗣️ You said: <strong>{transcript}</strong>
        </p>
      )}
    </div>
  );
};

export default VoiceInput;
