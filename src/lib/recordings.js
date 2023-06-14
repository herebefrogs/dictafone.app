import { writable } from 'svelte/store';

const createRecordings = () => {
  const { subscribe, update } = writable([]);

  return {
    subscribe,
    upsertRecording: recording => {
      update(recordings => {
        const index = recordings.findIndex(r => r.name === recording.name);
        if (index === -1) {
          return [...recordings, recording];
        }
        else {
          recordings[index] = {
            ...recordings[index],
            ...recording
          };
          return recordings;
        }
      });
    }
  }
}

export const recordings = createRecordings();