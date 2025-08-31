import React, { useEffect, useState } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import axios from 'axios';

const VoiceInput = ({ onResult }) => {
  const { transcript, resetTranscript, listening, browserSupportsSpeechRecognition } = useSpeechRecognition();
  const [micError, setMicError] = useState('');

  // Check if browser supports speech recognition
  useEffect(() => {
    if (!browserSupportsSpeechRecognition) {
      setMicError("⚠️ Your browser doesn't support Speech Recognition.");
    }
  }, [browserSupportsSpeechRecognition]);

  // Auto-send transcript when user stops speaking
  useEffect(() => {
    if (!listening && transcript) {
      handleSend();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listening]);

  // Handle microphone start
  const handleListen = async () => {
    // Check if page is HTTPS
    if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
      setMicError('⚠️ Microphone only works on HTTPS.');
      return;
    }

    try {
      resetTranscript();
      setMicError('');
      console.log("🎤 Mic started");
      await SpeechRecognition.startListening({
        continuous: true, // better reliability on deployed sites
        language: 'en-IN'
      });
    } catch (err) {
      console.error('❌ Mic start error:', err);
      setMicError('❌ Failed to start microphone.');
    }
  };

  // Send transcript to server
  const handleSend = async () => {
    if (!transcript) return;

    try {
      console.log('📤 Sending transcript:', transcript);
      const res = await axios.post(
        'https://shopping-list-with-ai-assistance.onrender.com/voice-command',
        { text: transcript }
      );
      onResult(res.data);
    } catch (err) {
      console.error('❌ Failed to send to server:', err);
      setMicError('❌ Server error. Check console.');
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

      {micError && (
        <p style={{ marginTop: '10px', color: 'red', fontWeight: 'bold' }}>
          {micError}
        </p>
      )}
    </div>
  );
};

export default VoiceInput;
