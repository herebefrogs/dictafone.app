import { writable } from 'svelte/store';
import { browser } from '$app/environment';

const { subscribe, set, update } = writable([]);

// IndexedDB logic
const DB_VERSION = 1;
let db;
let transcripts_value = [];

subscribe(t => { transcripts_value = t });

if (browser) {
  // open/create the database
  const request = window.indexedDB.open('dictafone.app', DB_VERSION);
  
  request.onerror = e => {
    throw new Error('IndexDB open database error: ' + e.target.errorCode, { cause: e });
  }
  // create schema for transcripts on first run
  request.onupgradeneeded = e => {
    db = e.target.result;
    
    db.createObjectStore('transcripts', { keyPath: 'id' });
  }
  // load all transcripts into store
  request.onsuccess = e => {
    db = e.target.result;
    
    db.onerror = e => {
      throw new Error('IndexDB access database error: ' + e.target.errorCode, { cause: e });
    }
    
    db.transaction('transcripts')
    .objectStore('transcripts')
    .getAll()
    .onsuccess = e => set(e.target.result);
  }
}

// Svelte store logic
const remove = id => {
  db.transaction(['transcripts'], 'readwrite')
    .objectStore('transcripts')
    .delete(id)
    .onsuccess = () => {
      update(transcripts => transcripts.filter(r => r.id !== id));
    }
};

const get = id => transcripts_value.find(r => r.id === id);

const upsert = transcript => {
  update(transcripts => {
    const index = transcripts.findIndex(r => r.id === transcript.id);
    if (index === -1) {
      db.transaction(['transcripts'], 'readwrite')
      .objectStore('transcripts')
      .add(transcript);

      return [...transcripts, transcript];
    }
    else {
      transcripts[index] = {
        ...transcripts[index],
        ...transcript
      };
      db.transaction(['transcripts'], 'readwrite')
      .objectStore('transcripts')
      .put(transcripts[index]);

      return transcripts;
    }
  });
};

export const transcripts = {
  subscribe,
  delete: remove,
  get,
  upsert,
};