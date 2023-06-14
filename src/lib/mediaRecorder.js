import { readable } from 'svelte/store';
import { id } from './transcript';
import { recordings } from './recordings';

let id_value;

const onDataAvailable = event => {
  const audio = event.data;

  recordings.upsert({ audio, date: Date.now(), id: id_value });
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

      id.subscribe(i => id_value = i);
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