import { audio } from './dictation';
import { readable } from 'svelte/store';
import { browser } from '$app/environment';

const onDataAvailable = event => {
  audio.set(event.data);
};

// not needed
const createMediaRecorder = () => {
  // make this a start function instead and create the readable thing directly in the if (browser)
  const { subscribe } = readable(null, set => {
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
  });

  return {
    subscribe
  }
};

let audioRecorder = readable();

if (browser) {
  if (!navigator.mediaDevices?.getUserMedia) {
    throw new Error('MediaDevices API not available on this browser.');
  }

  audioRecorder = createMediaRecorder();
}

export { audioRecorder };