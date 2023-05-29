import { Transcripter } from './transcripter.js';

let recorder = null;
let transcripter = null;

function startRecording() {
  recorder.start();
  btn_start.style.display = 'none';
  btn_pause.style.display = 'inline';
  btn_stop.style.display = 'inline';
  transcripter.start();
}

function stopRecording() {
  recorder.stop();
  btn_stop.style.display = 'none';
  btn_pause.style.display = 'none';
  btn_resume.style.display = 'none';
  btn_start.style.display = 'inline';
  transcripter.stop();
}

function pauseRecording() {
  recorder.pause();
  btn_pause.style.display = 'none';
  btn_start.style.display = 'none';
  btn_resume.style.display = 'inline';
  btn_stop.style.display = 'inline';
  transcripter.pause();
}

function resumeRecording() {
  recorder.resume();
  btn_resume.style.display = 'none';
  btn_pause.style.display = 'inline';
  btn_stop.style.display = 'inline';
  transcripter.resume();
}

function onAudioRecordingStopped(event) {
  // give a bit of time for the transcript to be completed
  // as recording stop and recognition stop are 2 separate events
  setTimeout(async () => {
    const recording = await saveAudioRecording(event.data, transcripter.text)

    if (recording) {
      appendAudioRecordingElement(createAudioRecordingElement(recording));
    }

    live_transcript.innerText = '';
  }, 250);
}

function getRecordings() {
  return JSON.parse(localStorage.getItem('recordings') || '[]');
}

function saveRecordings(recordings) {
  localStorage.setItem('recordings', JSON.stringify(recordings));
}

function readAudioRecording(recording) {
  const arrayBuffer = Uint8Array.from(recording.audio, c => c.charCodeAt(0)).buffer;
  const audioBlob = new Blob([arrayBuffer], { type: recording.type });
  // sanity check
  if (audioBlob.size !== recording.size) {
    console.error('audio blob size does not match expected size', recording.size, recording.transcript, recording.audio, recording.type)
    return document.createElement('p');
  }
  recording.blob = audioBlob;
  return createAudioRecordingElement(recording);
}

// save audio recording and full transcription to localStorage
async function saveAudioRecording(audioBlob, transcript) {
  const recordings = getRecordings();
  const name = prompt('Enter a name for this transcript. Click "Cancel" to discard transcript.', 'Recording ' + (recordings.length + 1));

  if (!name) {
    return;
  }

  const date = Date.now();

  const data = await audioBlob.arrayBuffer()
  let offset = 0;
  let audio = '';
  // if the array buffer is too large, it will exceed the maximum call stack size
  // for String.fromCharCode.apply() so encode it in small chunks
  while (offset < audioBlob.size) {
    const chunk = data.slice(offset, Math.min(offset + 1024, audioBlob.size));
    offset += 1024;
    audio += String.fromCharCode.apply(null, new Uint8Array(chunk));
  }

  const recording = { audio, date, name, size: audioBlob.size, transcript, type: audioBlob.type };

  recordings.push(recording);
  saveRecordings(recordings);

  recording.blob = audioBlob;
  return recording;
}

function appendAudioRecordingElement(audioRecordingElement) {
  document.getElementById('files').appendChild(audioRecordingElement);
}

function createAudioRecordingElement(recording) {
  const article = document.createElement('article');

  const dateName = document.createElement('p');
  dateName.innerText = `${new Date(recording.date).toLocaleString()} - ${recording.name}`;
  article.appendChild(dateName);

  const audioUrl = URL.createObjectURL(recording.blob);
  const audio = new Audio(audioUrl);
  audio.controls = true;
  article.appendChild(audio);

  const text = document.createElement('p');
  text.innerText = recording.transcript;
  article.appendChild(text);

  return article;
}

function displayError(msg) {
  document.getElementById('error').innerText = msg;
  console.error(msg);
}

async function getAudioRecorder() {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    displayError('MediaDevices or getUserMedia() not supported on this browser.');
    return;
  }
  
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    return new MediaRecorder(stream);
  } catch (err) {
    displayError('failed to access microphone due to ' + err);
    return;
  }
}


async function onload() {
  recorder = await getAudioRecorder();
  transcripter = new Transcripter();

  if (recorder && transcripter) {
    recorder.ondataavailable = onAudioRecordingStopped;
    transcripter.addEventListener('transcript_updated', (e) => {
      live_transcript.innerText = e.detail.text;
    });
    btn_start.onclick = startRecording;
    btn_stop.onclick = stopRecording;
    btn_pause.onclick = pauseRecording;
    btn_resume.onclick = resumeRecording;
    btn_stop.style.display = 'none';
    btn_pause.style.display = 'none';
    btn_resume.style.display = 'none';
    getRecordings().map(readAudioRecording).forEach(appendAudioRecordingElement);
  }
}

onload();