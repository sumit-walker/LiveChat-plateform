let audioContext = null;

const getAudioContext = () => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioContext;
};

export const unlockNotificationAudio = () => {
  const ctx = getAudioContext();
  if (ctx.state === "suspended") {
    ctx.resume();
  }
};

export const playNotificationSound = () => {
  try {
    const ctx = getAudioContext();
    if (ctx.state === "suspended") {
      ctx.resume();
    }

    const now = ctx.currentTime;
    const gain = ctx.createGain();
    gain.connect(ctx.destination);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.35, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.7);

    const playTone = (frequency, start, duration) => {
      const oscillator = ctx.createOscillator();
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(frequency, start);
      oscillator.connect(gain);
      oscillator.start(start);
      oscillator.stop(start + duration);
    };

    playTone(880, now, 0.18);
    playTone(1174, now + 0.14, 0.22);
    playTone(880, now + 0.32, 0.25);
  } catch (error) {
    console.log("Notification sound failed:", error);
  }
};
