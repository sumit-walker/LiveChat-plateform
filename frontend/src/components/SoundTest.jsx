import { soundManager } from "../lib/sound.js";
import { X } from "lucide-react";
import { useState } from "react";

function SoundTest() {
  const [isVisible, setIsVisible] = useState(true);
  
  const testSound = () => {
    soundManager.playNotification();
  };

  const toggleSound = () => {
    const current = soundManager.getSettings().isEnabled;
    soundManager.setEnabled(!current);
    window.location.reload(); // Refresh to see changes
  };

  const closeTest = () => {
    setIsVisible(false);
  };

  const settings = soundManager.getSettings();

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-base-200 p-4 rounded-lg shadow-lg z-50">
      {/* Close Button */}
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold">Sound Test (Remove in production)</h3>
        <button
          onClick={closeTest}
          className="btn btn-ghost btn-xs p-1 hover:bg-base-300 rounded-full"
          title="Close test panel"
        >
          <X className="size-4" />
        </button>
      </div>
      
      <div className="space-y-2">
        <button onClick={testSound} className="btn btn-sm btn-primary w-full">
          Test Sound
        </button>
        <button onClick={toggleSound} className="btn btn-sm btn-secondary w-full">
          {settings.isEnabled ? 'Disable' : 'Enable'} Sound
        </button>
        <div className="text-xs">
          Status: {settings.isEnabled ? 'Enabled' : 'Disabled'}
        </div>
        <div className="text-xs">
          Volume: {Math.round(settings.volume * 100)}%
        </div>
      </div>
    </div>
  );
}

export default SoundTest;
