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

function saveAudioRecording(event) {
  // give a bit of time for the transcript to be completed
  // as recording stop and recognition stop are 2 separate events
  setTimeout(() => {
    const audioUrl = URL.createObjectURL(event.data);
    const audio = new Audio(audioUrl);
    audio.controls = true;

    const article = document.createElement('article');
    article.appendChild(audio);
    const text = document.createElement('p');
    text.innerText = transcript.join('\n');
    article.appendChild(text);

    document.getElementById('files').appendChild(article);

    live_transcript.innerText = '';
  }, 250);


  // also worry about persistence at this point
}

function saveTranscription(event) {
  const result = event.results[event.resultIndex];
  if (result.isFinal) {
    const now = performance.now();
    elapsedTime += now - lastTime;
    lastTime = now;

    transcript.push(`${formatElapsedTime()} ${result[0].transcript}`);
    live_transcript.innerText = transcript.join('\n');
  }
}

function formatDigit(d) {
  return d < 10 ? '0' + d : d;
}

function formatElapsedTime() {
  const time = elapsedTime / 1000;
  const hours = Math.floor(time / 3600);
  const minutes = Math.floor((time - hours * 3600) / 60);
  const seconds = Math.floor((time - hours * 3600 - minutes * 60))
  return `[${formatDigit(hours)}:${formatDigit(minutes)}:${formatDigit(seconds)}]`;
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
    recorder.ondataavailable = saveAudioRecording;
    recognition.onresult = saveTranscription;
    btn_start.onclick = startRecording;
    btn_stop.onclick = stopRecording;
    btn_pause.onclick = pauseRecording;
    btn_resume.onclick = resumeRecording;
    btn_stop.style.display = 'none';
    btn_pause.style.display = 'none';
    btn_resume.style.display = 'none';
  }
}

onload();