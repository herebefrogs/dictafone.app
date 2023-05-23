recorder = null;

function startRecording() {
  recorder.start();
  btn_start.style.display = 'none';
  btn_pause.style.display = 'inline';
  btn_stop.style.display = 'inline';
}

function stopRecording() {
  recorder.stop();
  btn_stop.style.display = 'none';
  btn_pause.style.display = 'none';
  btn_resume.style.display = 'none';
  btn_start.style.display = 'inline';
}

function pauseRecording() {
  recorder.pause();
  btn_pause.style.display = 'none';
  btn_start.style.display = 'none';
  btn_resume.style.display = 'inline';
  btn_stop.style.display = 'inline';
}

function resumeRecording() {
  recorder.resume();
  btn_resume.style.display = 'none';
  btn_pause.style.display = 'inline';
  btn_stop.style.display = 'inline';

}


function displayError(msg) {
  document.getElementById('error').innerText = msg;
  console.error(msg);
}

async function getAudioRecorder() {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    displayError('mediaDevices or getUserMedia() not supported on this browser.');
    return;
  }
  
  try {
    stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    return new MediaRecorder(stream);
  } catch (err) {
    displayError('failed accessing micrphone due to ' + err);
    return;
  }
}

async function onload() {
  recorder = await getAudioRecorder();

  if (recorder) {
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