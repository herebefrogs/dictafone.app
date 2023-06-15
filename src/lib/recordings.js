import { writable } from "svelte/store";

const { subscribe, set, update } = writable([]);

// IndexedDB logic
const DB_VERSION = 1;
let db;

// open/create the database
const request = window.indexedDB.open("dictafone.app", DB_VERSION);

request.onerror = e => {
  // TODO handle
  console.error("Open database error:", e.target.errorCode);
}
// create schema for recordings on first run
request.onupgradeneeded = e => {
  db = e.target.result;

  db.createObjectStore("recordings", { keyPath: "id" });
}
// load all recordings into store
request.onsuccess = e => {
  db = e.target.result;

  db.onerror = e => {
    // TODO handle
    console.error("Database error:", e.target.errorCode);
  }

  db.transaction("recordings")
    .objectStore("recordings")
    .getAll()
    .onsuccess = e => set(e.target.result);
}


// Svelte store logic
const _delete = id => {
  db.transaction(["recordings"], "readwrite")
    .objectStore("recordings")
    .delete(id)
    .onsuccess = () => {
      update(recordings => recordings.filter(r => r.id !== id));
    }
};

const upsert = recording => {
  update(recordings => {
    const index = recordings.findIndex(r => r.id === recording.id);
    if (index === -1) {
      db.transaction(["recordings"], "readwrite")
      .objectStore("recordings")
      .add(recording);

      return [...recordings, recording];
    }
    else {
      recordings[index] = {
        ...recordings[index],
        ...recording
      };
      db.transaction(["recordings"], "readwrite")
      .objectStore("recordings")
      .put(recordings[index]);

      return recordings;
    }
  });
};

export const recordings = {
  subscribe,
  delete: _delete,
  upsert,
};
