import { readable } from 'svelte/store';
import { name } from './transcript';
import { recordings } from './recordings';

let name_value;

const onDataAvailable = event => {
  const audio = event.data;

  const recording = {
    audio,
    date: Date.now(),
    name: name_value,
  }

  recordings.upsertRecording(recording);
};

const createMediaRecorder = () => {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    throw new Error('MediaDevices or getUserMedia() not supported on this browser.');
  }

  let recorder;

  const { subscribe } = readable(null, set => {
    navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
      recorder = new MediaRecorder(stream);
      recorder.ondataavailable = onDataAvailable;
      set(recorder);

      name.subscribe(n => name_value = n);
    })
    // TODO handle
    .catch(err => {
      throw new Error('Microphone not accessible due to ' + err);
    });

    return () => { recorder.stop(); }
  });

  return {
    subscribe
  }
};

export const mediaRecorder = createMediaRecorder();