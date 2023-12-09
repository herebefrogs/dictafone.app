import { audio } from '$lib/stores/transcript';
import { readable } from 'svelte/store';
import { browser } from '$app/environment';
import { isAndroid } from '$lib/helpers/mobile';

export const audioRecorder = readable({
  start: () => {},
  stop: () => {},
  pause: () => {},
  resume: () => {},
}, init);


function init(set) {
  let recorder;

  if (browser && !isAndroid) {
    if (!navigator.mediaDevices?.getUserMedia) {
      throw new Error('MediaDevices API not available on this browser.');
    }

    set({
      // instancialize a new MediaRecorder instance & start it right away
      start: async () => {
        try {
          // BUG: this causes speech recognition to stop working on Chrome for Android
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          recorder = new MediaRecorder(stream);
          recorder.ondataavailable = e => {
            audio.set(e.data);
          };

          recorder.start();
        } catch (err) {
          console.error('Microphone not accessible. ' + err);
        }
      },
      stop: () => {
        recorder.stop();
      },
      pause: () => {
        recorder.pause();
      },
      resume: () => {
        recorder.resume();
      },
    });
  }

  return () => recorder && recorder.stop();
}
