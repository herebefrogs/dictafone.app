import { getRecordings, getRecordingsCount } from './storage.js';
import { Recorder } from './recorder.js';
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
  const name = prompt('Enter a name for this transcript. Click "Cancel" to discard transcript.', 'Recording ' + (getRecordingsCount() + 1));

  if (name) {
    recorder.stop(name);
    btn_stop.style.display = 'none';
    btn_pause.style.display = 'none';
    btn_resume.style.display = 'none';
    btn_start.style.display = 'inline';
    transcripter.stop(name);
  }
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

function appendAudioRecordingElement(audioRecordingElement) {
  document.getElementById('files').appendChild(audioRecordingElement);
}

function createAudioRecordingElement(recording) {
  const article = document.createElement('article');

  const dateName = document.createElement('p');
  dateName.innerText = `${new Date(recording.date).toLocaleString()} - ${recording.name}`;
  article.appendChild(dateName);

  const audioUrl = URL.createObjectURL(recording.audio);
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

function onload() {
  try {
    recorder = new Recorder();
    transcripter = new Transcripter();
  } catch(e) {
    displayError(e.message);
  }

  if (recorder && transcripter) {
    transcripter.addEventListener('transcript_updated', (e) => {
      live_transcript.innerText = e.detail.text;
    });
    transcripter.addEventListener('transcript_finalized', (e) => {
      live_transcript.innerText = '';
      // if the recording was saved first
      if (e.detail.recording.audio) {
        appendAudioRecordingElement(createAudioRecordingElement(e.detail.recording));
      }
    });
    recorder.addEventListener('recording_finalized', (e) => {
      // if the transcript was saved first
      if (e.details.recording.transcript) {
        appendAudioRecordingElement(createAudioRecordingElement(e.detail.recording));
      }
    });
    btn_start.onclick = startRecording;
    btn_stop.onclick = stopRecording;
    btn_pause.onclick = pauseRecording;
    btn_resume.onclick = resumeRecording;
    btn_stop.style.display = 'none';
    btn_pause.style.display = 'none';
    btn_resume.style.display = 'none';
    getRecordings().map(createAudioRecordingElement).forEach(appendAudioRecordingElement);
  }
}

onload();