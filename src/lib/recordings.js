import { writable } from 'svelte/store';

const { subscribe, update } = writable([]);

const _delete = id => {
  update(recordings => recordings.filter(r => r.id !== id));
};

const upsert = recording => {
  update(recordings => {
    const index = recordings.findIndex(r => r.id === recording.id);
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
};

export const recordings = {
  subscribe,
  delete: _delete,
  upsert,
};
