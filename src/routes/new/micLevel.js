import { started, paused } from '$lib/stores/transcript';
import { browser } from '$app/environment';
import { readable } from 'svelte/store';

export const micLevel = readable(0, start);

function start(set) {
  let analyser;
  let intervalID;
  let $started = false;
  let $paused = false;
  
  function resetVolume() {
    clearInterval(intervalID);
    set(0);
  }
  
  function stop() {
    resetVolume();
  }

  function calculateVolume() {
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyser.getByteFrequencyData(dataArray);
  
    const volume = Math.round(Math.sqrt(dataArray.reduce((sum, val) => sum += val*val, 0) / bufferLength));
  
    // we won't want the volume visualizer to jitter when the volume is low
    return volume > 10 ? volume : 0;
  }

  function toggleVolume(s, p) {
    $started = s;
    $paused = p;
  
    if ($started && !$paused) {
      // TODO move this off the main thread with background audio worklet
      intervalID = setInterval(() => set(calculateVolume()), 100);
    } else {
      resetVolume();
    }
  }
  
  if (browser) {
    if (!navigator.mediaDevices?.getUserMedia) {
      throw new Error('MediaDevices API not available on this browser.');
    }
  
    // TODO maybe that should be delayed until after the user click start/resume/pause/stop?
    // BUG: this causes speech recognition to stop working on Chrome for Android
    navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
      const audioContext = new AudioContext();
      const microphone = audioContext.createMediaStreamSource(stream);
      analyser = audioContext.createAnalyser();
      microphone.connect(analyser);
  
      // we want the volume to go back to 0 immediately after the sound stops
      // so do not overlap the sample
      analyser.smoothingTimeConstant = 0;
  
      started.subscribe(s => toggleVolume(s, $paused));
      paused.subscribe(p => toggleVolume($started, p));
    })
    .catch(err => {
     throw new Error('Microphone not accessible. ' + err);
    });
  }

  return stop;
};