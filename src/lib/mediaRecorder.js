import { error } from './error';
import { recordings } from './recordings';
import { readable } from 'svelte/store';
import { id } from './transcript';

let id_value;

const onDataAvailable = event => {
  const audio = event.data;

  recordings.upsert({ audio, date: Date.now(), id: id_value });
};

const createMediaRecorder = () => {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    error.set('navigator.MediaDevices or navigator.getUserMedia() not supported on this browser.');
    return;
  }

  const { subscribe } = readable(null, set => {
    let recorder;

    navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
      recorder = new MediaRecorder(stream);
      recorder.ondataavailable = onDataAvailable;
      set(recorder);

      id.subscribe(i => id_value = i);
    })
    .catch(err => {
      error.set('Microphone not accessible due to ' + err);
      set(null);
    });

    return () => recorder && recorder.stop();
  });

  return {
    subscribe
  }
};

export const mediaRecorder = createMediaRecorder();