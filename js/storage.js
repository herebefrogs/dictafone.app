export function getRecordingsCount() {
  return loadRecordings().length;
}

export function getRecordings() {
  return loadRecordings().map(parseRecording);
}

export function findRecording(name) {
  const recording = loadRecordings().find(r => r.name === name);
  return recording && recording.audio ? parseRecording(recording) : { name };
}

export async function saveRecording(recording) {
  recording = await stringifyRecording(recording);

  const recordings = loadRecordings();
  const index = recordings.findIndex(r => r.name === recording.name);
  if (index !== -1) {
    recordings.splice(index, 1, recording);
  } else {
    recordings.push(recording);
  }
  writeRecordings(recordings);
}


// private helpers

function loadRecordings() {
  return JSON.parse(localStorage.getItem('recordings') || '[]');
}

function writeRecordings(recordings) {
  localStorage.setItem('recordings', JSON.stringify(recordings));
}

// rehydrate audio from text form into Blob form
function parseRecording(recording) {
  const arrayBuffer = Uint8Array.from(recording.audio, c => c.charCodeAt(0)).buffer;
  const audio = new Blob([arrayBuffer], { type: recording.type });
  // sanity check
  if (audio.size !== recording.size) {
    console.error('audio blob size didn\'t match expected size', recording.name, recording.size, audio.size)
    return;
  }
  return { ...recording, audio }
}

async function stringifyRecording(recording) {
  return recording.audio.arrayBuffer().then(data => {
      let offset = 0;
      let audio = '';
      
      // a large array buffer (~25+ sec from empirical results) will exceed the maximum
      // call stack size of String.fromCharCode.apply() so encode it in smaller chunks
      while (offset < recording.audio.size) {
        const chunk = data.slice(offset, Math.min(offset + 1024, recording.audio.size));
        offset += 1024;
        audio += String.fromCharCode.apply(null, new Uint8Array(chunk));
      }   
      return { ...recording, audio };
    });
  }