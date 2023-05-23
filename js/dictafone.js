function displayError(msg) {
  document.getElementById('error').innerText = msg;
  console.error(msg);
}

async function onload() {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    displayError('mediaDevices or getUserMedia() not supported on this browser.');
    return;
  }
  
  try {
    stream = await navigator.mediaDevices.getUserMedia({ audio: true });

  } catch (err) {
    displayError('failed accessing micrphone due to ' + err);
  }
}

onload();