class SoundManager {
  constructor() {
    this.audio = null;
    this.isEnabled = localStorage.getItem('chat-sound-enabled') !== 'false';
    this.volume = parseFloat(localStorage.getItem('chat-sound-volume') || '0.5');
    this.initAudio();
  }

  initAudio() {
    // Create audio element with a default notification sound
    this.audio = new Audio();
    
    // Use a custom audio file for better sound quality
    this.audio.src = '/sounds/notification.mp3';
    
    // Fallback to beep sound if audio file fails to load
    this.audio.onerror = () => {
      console.warn('Audio file failed to load, using beep sound');
      this.audio.src = null;
    };
    
    this.audio.volume = this.volume;
    this.audio.preload = 'auto';
  }

  // Create a simple beep sound using Web Audio API
  createBeepSound() {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
      
      return null; // Return null since we're using Web Audio API
    } catch (error) {
      console.warn('Web Audio API not supported, using fallback');
      return null;
    }
  }

  // Play notification sound
  playNotification() {
    if (!this.isEnabled) return;
    
    try {
      if (this.audio.src && this.audio.src !== window.location.href) {
        // If using audio file
        this.audio.currentTime = 0;
        this.audio.play().catch(error => {
          console.warn('Failed to play audio file, using beep sound:', error);
          this.createBeepSound();
        });
      } else {
        // If using Web Audio API (fallback)
        this.createBeepSound();
      }
    } catch (error) {
      console.warn('Sound playback failed:', error);
    }
  }

  // Enable/disable sound
  setEnabled(enabled) {
    this.isEnabled = enabled;
    localStorage.setItem('chat-sound-enabled', enabled);
  }

  // Set volume (0.0 to 1.0)
  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume));
    if (this.audio) {
      this.audio.volume = this.volume;
    }
    localStorage.setItem('chat-sound-volume', this.volume);
  }

  // Get current settings
  getSettings() {
    return {
      isEnabled: this.isEnabled,
      volume: this.volume
    };
  }
}

// Create and export a singleton instance
export const soundManager = new SoundManager();

// Export the class for testing purposes
export { SoundManager };
