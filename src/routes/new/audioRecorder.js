import { audio } from '$lib/stores/transcript';
import { readable } from 'svelte/store';
import { browser } from '$app/environment';

let audioRecorder;


const onDataAvailable = event => {
  audio.set(event.data);
};

function start(set) {
  let recorder;

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

  audioRecorder = readable(null, start);
}

export { audioRecorder };