import { Howl, Howler } from 'howler';
import { usePlayerStore, type Track } from '../store/usePlayerStore';

class AudioEngine {
  private currentHowl: Howl | null = null;
  private timerId: number | null = null;

  constructor() {
    Howler.volume(usePlayerStore.getState().volume);

    // Subscribe to volume changes
    usePlayerStore.subscribe((state) => {
      Howler.volume(state.volume);
    });
  }

  play(track: Track) {
    if (this.currentHowl) {
      this.currentHowl.stop();
      this.currentHowl.unload();
      this.stopProgressTimer();
    }

    this.currentHowl = new Howl({
      src: [track.url],
      html5: true, // Force HTML5 Audio to allow streaming large files
      format: ['mp3', 'flac', 'wav', 'm4a', 'ogg'],
      volume: usePlayerStore.getState().volume,
      onplay: () => {
        usePlayerStore.getState().resume();
        const duration = this.currentHowl?.duration() || 0;
        usePlayerStore.getState().setDuration(duration);
        this.startProgressTimer();
      },
      onpause: () => {
        usePlayerStore.getState().pause();
        this.stopProgressTimer();
      },
      onend: () => {
        const state = usePlayerStore.getState();
        this.stopProgressTimer();
        state.setProgress(0);
        state.setCurrentTime(0);

        // Handle next track logic
        if (state.repeatMode === 'one') {
          this.play(track);
        } else {
          // Trigger the next track logic in the store.
          // The BottomPlayer's useEffect will detect the track change and call play()
          state.playNext();
        }
      },
      onloaderror: (_id, error) => {
        console.error('AudioEngine Load Error:', error);
      },
      onplayerror: (_id, error) => {
        console.error('AudioEngine Play Error:', error);
      }
    });

    this.currentHowl.play();
    usePlayerStore.getState().playTrack(track);
  }

  pause() {
    if (this.currentHowl) {
      this.currentHowl.pause();
    }
  }

  resume() {
    if (this.currentHowl && !this.currentHowl.playing()) {
      this.currentHowl.play();
    }
  }

  togglePlay() {
    if (this.currentHowl) {
      if (this.currentHowl.playing()) {
        this.pause();
      } else {
        this.resume();
      }
    }
  }

  seek(time: number) {
    if (this.currentHowl) {
      this.currentHowl.seek(time);
      usePlayerStore.getState().setCurrentTime(time);
      const duration = this.currentHowl.duration();
      if (duration > 0) {
        usePlayerStore.getState().setProgress(time / duration);
      }
    }
  }

  setVolume(volume: number) {
    Howler.volume(volume);
    usePlayerStore.getState().setVolume(volume);
  }

  private startProgressTimer() {
    if (this.timerId !== null) {
      window.clearInterval(this.timerId);
    }
    this.timerId = window.setInterval(() => {
      if (this.currentHowl && this.currentHowl.playing()) {
        const currentTime = this.currentHowl.seek() as number;
        const duration = this.currentHowl.duration();
        usePlayerStore.getState().setCurrentTime(currentTime);
        if (duration > 0) {
          usePlayerStore.getState().setProgress(currentTime / duration);
        }
      }
    }, 500);
  }

  private stopProgressTimer() {
    if (this.timerId !== null) {
      window.clearInterval(this.timerId);
      this.timerId = null;
    }
  }
}

export const audioEngine = new AudioEngine();
