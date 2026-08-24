import { ref, reactive } from 'vue';

// SINGLETON AUDIO INSTANCE & REACTIVE STATE (Defined outside composable function)
const audio = new Audio();

const currentLesson = ref(null);
const isPlaying = ref(false);
const currentTime = ref(0);
const duration = ref(0);
const volume = ref(1);
const playbackRate = ref(1);

// Attach HTML5 Audio Event Listeners ONCE
audio.addEventListener('timeupdate', () => {
  currentTime.value = audio.currentTime || 0;
});

audio.addEventListener('loadedmetadata', () => {
  duration.value = audio.duration || 0;
});

audio.addEventListener('durationchange', () => {
  duration.value = audio.duration || 0;
});

audio.addEventListener('ended', () => {
  isPlaying.value = false;
  currentTime.value = 0;
});

audio.addEventListener('play', () => {
  isPlaying.value = true;
});

audio.addEventListener('pause', () => {
  isPlaying.value = false;
});

audio.addEventListener('error', (err) => {
  console.error('Audio playback error:', err);
  isPlaying.value = false;
});

export function useAudioPlayer() {
  const playLesson = (lesson) => {
    if (!lesson || !lesson.audioUrl) return;

    if (currentLesson.value && currentLesson.value.id === lesson.id) {
      togglePlay();
      return;
    }

    currentLesson.value = lesson;
    audio.src = lesson.audioUrl;
    audio.load();
    audio.play().then(() => {
      isPlaying.value = true;
    }).catch(err => {
      console.warn('Audio autoplay prevented or failed:', err);
      isPlaying.value = false;
    });
  };

  const togglePlay = () => {
    if (!currentLesson.value) return;
    if (isPlaying.value) {
      audio.pause();
    } else {
      audio.play().catch(err => console.warn('Play error:', err));
    }
  };

  const pause = () => {
    audio.pause();
  };

  const seek = (time) => {
    if (!isNaN(time)) {
      audio.currentTime = time;
      currentTime.value = time;
    }
  };

  const skip = (seconds) => {
    const newTime = Math.min(Math.max(0, audio.currentTime + seconds), duration.value || 9999);
    seek(newTime);
  };

  const setRate = (rate) => {
    playbackRate.value = rate;
    audio.playbackRate = rate;
  };

  const setVolume = (vol) => {
    const clamped = Math.min(Math.max(0, vol), 1);
    volume.value = clamped;
    audio.volume = clamped;
  };

  const formatTime = (secs) => {
    if (!secs || isNaN(secs)) return '00:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return {
    // State
    currentLesson,
    isPlaying,
    currentTime,
    duration,
    volume,
    playbackRate,

    // Methods
    playLesson,
    togglePlay,
    pause,
    seek,
    skip,
    setRate,
    setVolume,
    formatTime
  };
}
