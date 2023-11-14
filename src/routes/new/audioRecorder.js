import { audio } from '$lib/stores/transcript';
import { readable } from 'svelte/store';
import { browser } from '$app/environment';
import { isAndroid } from '$lib/helpers/mobile';

let audioRecorder = readable({
  start: () => {},
  stop: () => {},
  pause: () => {},
  resume: () => {},
});


const onDataAvailable = event => {
  audio.set(event.data);
};

function start(set) {
  let recorder;

  // BUG: this causes speech recognition to stop working on Chrome for Android
  navigator.mediaDevices.getUserMedia({ audio: true })
  .then(stream => {
    recorder = new MediaRecorder(stream);
    recorder.ondataavailable = onDataAvailable;
    set(recorder);
  })
  .catch(err => {
    throw new Error('Microphone not accessible. ' + err);
  });

  return () => recorder && recorder.stop();
}


if (browser) {
  if (!navigator.mediaDevices?.getUserMedia) {
    throw new Error('MediaDevices API not available on this browser.');
  }

  if (!isAndroid) {
    // prevent audio recorder to block speech recognition from working on Chrome for Android
    audioRecorder = readable(null, start);
  }
}

export { audioRecorder };