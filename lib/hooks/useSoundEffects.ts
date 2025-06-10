import { useRef, useCallback, useState } from 'react';

type SoundType = 
  | 'complete' 
  | 'snooze' 
  | 'reschedule' 
  | 'undo' 
  | 'redo' 
  | 'delete' 
  | 'select' 
  | 'bulk_action'
  | 'notification'
  | 'error'
  | 'success';

interface SoundSettings {
  enabled: boolean;
  volume: number;
  theme: 'minimal' | 'nature' | 'digital' | 'retro';
}

interface UseSoundEffectsReturn {
  playSound: (type: SoundType) => void;
  settings: SoundSettings;
  updateSettings: (newSettings: Partial<SoundSettings>) => void;
  preloadSounds: () => void;
}

export function useSoundEffects(): UseSoundEffectsReturn {
  const audioContextRef = useRef<AudioContext | null>(null);
  const [settings, setSettings] = useState<SoundSettings>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('taskSoundSettings');
      return saved ? JSON.parse(saved) : {
        enabled: true,
        volume: 0.3,
        theme: 'minimal'
      };
    }
    return {
      enabled: true,
      volume: 0.3,
      theme: 'minimal'
    };
  });

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  // Sound generation functions using Web Audio API
  const generateTone = useCallback((frequency: number, duration: number, type: OscillatorType = 'sine') => {
    if (!settings.enabled) return;

    const audioContext = getAudioContext();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);

    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(settings.volume, audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
  }, [settings.enabled, settings.volume, getAudioContext]);

  const generateChord = useCallback((frequencies: number[], duration: number) => {
    if (!settings.enabled) return;
    frequencies.forEach(freq => generateTone(freq, duration));
  }, [generateTone, settings.enabled]);

  const generateNoise = useCallback((duration: number, filterFreq: number) => {
    if (!settings.enabled) return;

    const audioContext = getAudioContext();
    const bufferSize = audioContext.sampleRate * duration;
    const noiseBuffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    // Generate white noise
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const noiseSource = audioContext.createBufferSource();
    const filter = audioContext.createBiquadFilter();
    const gainNode = audioContext.createGain();

    noiseSource.buffer = noiseBuffer;
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(filterFreq, audioContext.currentTime);

    noiseSource.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(audioContext.destination);

    gainNode.gain.setValueAtTime(settings.volume * 0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);

    noiseSource.start(audioContext.currentTime);
    noiseSource.stop(audioContext.currentTime + duration);
  }, [settings.enabled, settings.volume, getAudioContext]);

  // Theme-specific sound definitions
  const soundThemes = {
    minimal: {
      complete: () => generateTone(800, 0.2),
      snooze: () => generateTone(400, 0.3),
      reschedule: () => generateTone(600, 0.25),
      undo: () => generateTone(300, 0.15),
      redo: () => generateTone(500, 0.15),
      delete: () => generateTone(200, 0.4),
      select: () => generateTone(1000, 0.1),
      bulk_action: () => generateChord([400, 500, 600], 0.3),
      notification: () => generateTone(880, 0.2),
      error: () => generateTone(150, 0.5),
      success: () => generateChord([523, 659, 784], 0.4)
    },
    nature: {
      complete: () => {
        // Bird chirp-like sound
        generateTone(1200, 0.1);
        setTimeout(() => generateTone(1000, 0.1), 100);
        setTimeout(() => generateTone(1400, 0.15), 200);
      },
      snooze: () => {
        // Gentle wind-like sound
        generateNoise(0.5, 200);
      },
      reschedule: () => {
        // Water drop sound
        generateTone(800, 0.05);
        setTimeout(() => generateTone(400, 0.2), 50);
      },
      undo: () => generateTone(600, 0.2),
      redo: () => generateTone(700, 0.2),
      delete: () => generateNoise(0.3, 100),
      select: () => generateTone(1500, 0.08),
      bulk_action: () => {
        // Multiple bird sounds
        [1200, 1000, 1400, 1100].forEach((freq, i) => {
          setTimeout(() => generateTone(freq, 0.1), i * 80);
        });
      },
      notification: () => generateTone(1760, 0.25),
      error: () => generateNoise(0.4, 150),
      success: () => {
        // Happy bird sequence
        [1200, 1400, 1600, 1800].forEach((freq, i) => {
          setTimeout(() => generateTone(freq, 0.15), i * 100);
        });
      }
    },
    digital: {
      complete: () => {
        // 8-bit style completion sound
        generateTone(523, 0.1, 'square');
        setTimeout(() => generateTone(659, 0.1, 'square'), 100);
        setTimeout(() => generateTone(784, 0.2, 'square'), 200);
      },
      snooze: () => {
        // Descending digital sound
        [800, 600, 400, 200].forEach((freq, i) => {
          setTimeout(() => generateTone(freq, 0.1, 'sawtooth'), i * 50);
        });
      },
      reschedule: () => {
        // Digital beep sequence
        generateTone(1000, 0.1, 'square');
        setTimeout(() => generateTone(1200, 0.1, 'square'), 150);
      },
      undo: () => generateTone(400, 0.15, 'triangle'),
      redo: () => generateTone(600, 0.15, 'triangle'),
      delete: () => {
        // Digital destroy sound
        [200, 150, 100, 50].forEach((freq, i) => {
          setTimeout(() => generateTone(freq, 0.1, 'sawtooth'), i * 50);
        });
      },
      select: () => generateTone(1500, 0.05, 'square'),
      bulk_action: () => {
        // Digital fanfare
        [400, 500, 600, 800].forEach((freq, i) => {
          setTimeout(() => generateTone(freq, 0.15, 'square'), i * 80);
        });
      },
      notification: () => {
        generateTone(880, 0.1, 'square');
        setTimeout(() => generateTone(1100, 0.1, 'square'), 100);
      },
      error: () => {
        // Harsh digital error
        [100, 80, 60].forEach((freq, i) => {
          setTimeout(() => generateTone(freq, 0.2, 'sawtooth'), i * 100);
        });
      },
      success: () => {
        // Victory fanfare
        [523, 659, 784, 1047].forEach((freq, i) => {
          setTimeout(() => generateTone(freq, 0.2, 'square'), i * 150);
        });
      }
    },
    retro: {
      complete: () => {
        // Classic game completion
        [262, 330, 392, 523].forEach((freq, i) => {
          setTimeout(() => generateTone(freq, 0.15, 'triangle'), i * 100);
        });
      },
      snooze: () => {
        // Sleepy retro sound
        [400, 350, 300, 250].forEach((freq, i) => {
          setTimeout(() => generateTone(freq, 0.2, 'sine'), i * 150);
        });
      },
      reschedule: () => {
        // Retro notification
        generateTone(440, 0.1, 'triangle');
        setTimeout(() => generateTone(880, 0.1, 'triangle'), 100);
        setTimeout(() => generateTone(440, 0.1, 'triangle'), 200);
      },
      undo: () => {
        generateTone(330, 0.1, 'triangle');
        setTimeout(() => generateTone(262, 0.1, 'triangle'), 100);
      },
      redo: () => {
        generateTone(262, 0.1, 'triangle');
        setTimeout(() => generateTone(330, 0.1, 'triangle'), 100);
      },
      delete: () => {
        // Retro explosion
        [200, 180, 160, 140, 120, 100].forEach((freq, i) => {
          setTimeout(() => generateTone(freq, 0.1, 'sawtooth'), i * 50);
        });
      },
      select: () => generateTone(1320, 0.05, 'triangle'),
      bulk_action: () => {
        // Retro power-up
        [220, 330, 440, 660].forEach((freq, i) => {
          setTimeout(() => generateTone(freq, 0.12, 'triangle'), i * 80);
        });
      },
      notification: () => {
        generateTone(660, 0.1, 'triangle');
        setTimeout(() => generateTone(880, 0.1, 'triangle'), 120);
        setTimeout(() => generateTone(1100, 0.15, 'triangle'), 240);
      },
      error: () => {
        // Classic error sound
        [150, 100, 75].forEach((freq, i) => {
          setTimeout(() => generateTone(freq, 0.3, 'triangle'), i * 200);
        });
      },
      success: () => {
        // Classic victory
        [523, 587, 659, 698, 784, 880, 988, 1047].forEach((freq, i) => {
          setTimeout(() => generateTone(freq, 0.1, 'triangle'), i * 80);
        });
      }
    }
  };

  const playSound = useCallback((type: SoundType) => {
    if (!settings.enabled) return;

    try {
      const themeSound = soundThemes[settings.theme][type];
      if (themeSound) {
        themeSound();
      }
    } catch (error) {
      console.warn('Failed to play sound:', error);
    }
  }, [settings.enabled, settings.theme, soundThemes]);

  const updateSettings = useCallback((newSettings: Partial<SoundSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('taskSoundSettings', JSON.stringify(updated));
    }
  }, [settings]);

  const preloadSounds = useCallback(() => {
    // Initialize audio context on user interaction
    if (audioContextRef.current?.state === 'suspended') {
      audioContextRef.current.resume();
    }
  }, []);

  return {
    playSound,
    settings,
    updateSettings,
    preloadSounds
  };
} 