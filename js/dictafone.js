let recorder = null;
let recognition = null;
let transcript = null;
let lastTime = 0
let elapsedTime = 0;

function startRecording() {
  recorder.start();
  btn_start.style.display = 'none';
  btn_pause.style.display = 'inline';
  btn_stop.style.display = 'inline';
  recognition.start();
  transcript = [];
  lastTime = performance.now();
  elapsedTime = 0;
}

function stopRecording() {
  recorder.stop();
  btn_stop.style.display = 'none';
  btn_pause.style.display = 'none';
  btn_resume.style.display = 'none';
  btn_start.style.display = 'inline';
  recognition.stop();
  elapsedTime += performance.now() - lastTime;
}

function pauseRecording() {
  recorder.pause();
  btn_pause.style.display = 'none';
  btn_start.style.display = 'none';
  btn_resume.style.display = 'inline';
  btn_stop.style.display = 'inline';
  elapsedTime += performance.now() - lastTime;
}

function resumeRecording() {
  recorder.resume();
  btn_resume.style.display = 'none';
  btn_pause.style.display = 'inline';
  btn_stop.style.display = 'inline';
  lastTime = performance.now();
}

function onAudioRecordingStopped(event) {
  // give a bit of time for the transcript to be completed
  // as recording stop and recognition stop are 2 separate events
  setTimeout(() => {
    saveAudioRecording(event.data, transcript.join('\n'))

    appendAudioRecordingElement(createAudioRecordingElement(event.data, transcript.join('\n')));

    live_transcript.innerText = '';
  }, 250);
}

function onNewTranscriptionAvailable(event) {
  const result = event.results[event.resultIndex];
  if (result.isFinal) {
    const now = performance.now();
    elapsedTime += now - lastTime;
    lastTime = now;

    transcript.push(`${formatElapsedTime()} ${result[0].transcript}`);
    live_transcript.innerText = transcript.join('\n');
  }
}

function getRecordings() {
  return JSON.parse(localStorage.getItem('recordings') || '[]');
}

function saveRecordings(recordings) {
  localStorage.setItem('recordings', JSON.stringify(recordings));
}

function readAudioRecording({ audio, size, transcript, type}) {
  const arrayBuffer = Uint8Array.from(audio, c => c.charCodeAt(0)).buffer;
  const audioBlob = new Blob([arrayBuffer], { type: type });
  // sanity check
  if (audioBlob.size !== size) {
    console.error('audio blob size does not match expected size', size, transcript, audio, type)
    return document.createElement('p');
  }
  return createAudioRecordingElement(audioBlob, transcript);
}

// save audio recording and full transcription to localStorage
function saveAudioRecording(audioBlob, transcript) {
  audioBlob.arrayBuffer().then(data => {
    let offset = 0;
    let audio = '';
    // if the array buffer is too large, it will exceed the maximum call stack size
    // for String.fromCharCode.apply() so encode it in small chunks
    while (offset < audioBlob.size) {
      const chunk = data.slice(offset, Math.min(offset + 1024, audioBlob.size));
      offset += 1024;
      audio += String.fromCharCode.apply(null, new Uint8Array(chunk));
    }

    const recordings = getRecordings();
    recordings.push({ audio, size: audioBlob.size, transcript, type: audioBlob.type });
    saveRecordings(recordings);
  });
}

function appendAudioRecordingElement(audioRecordingElement) {
  document.getElementById('files').appendChild(audioRecordingElement);
}

function createAudioRecordingElement(audioBlob, fullTranscript) {
  const article = document.createElement('article');

  const audioUrl = URL.createObjectURL(audioBlob);
  const audio = new Audio(audioUrl);
  audio.controls = true;
  article.appendChild(audio);

  const text = document.createElement('p');
  text.innerText = fullTranscript;
  article.appendChild(text);

  return article;
}

function formatDigit(d) {
  return d < 10 ? '0' + d : d;
}

function formatElapsedTime() {
  const time = elapsedTime / 1000;
  const hours = Math.floor(time / 3600);
  const minutes = Math.floor((time - hours * 3600) / 60);
  const seconds = Math.floor((time - hours * 3600 - minutes * 60))
  return `[${hours ? formatDigit(hours) + ':' : ''}${formatDigit(minutes)}:${formatDigit(seconds)}]`;
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
    stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    return new MediaRecorder(stream);
  } catch (err) {
    displayError('failed to access microphone due to ' + err);
    return;
  }
}

function getSpeechRecognition() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    displayError('SpeechRecognition not supported on this browser.');
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = 'en-US';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;
  recognition.continuous = true;
  return recognition
}

async function onload() {
  recorder = await getAudioRecorder();
  recognition = getSpeechRecognition();

  if (recorder && recognition) {
    recorder.ondataavailable = onAudioRecordingStopped;
    recognition.onresult = onNewTranscriptionAvailable;
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