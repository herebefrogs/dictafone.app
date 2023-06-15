import { readable } from "svelte/store";
import { started, paused } from "./dictation";


let analyser;
let intervalID;
let paused_value = false;
let started_value = false;
let set_value;

const calculateVolume = () => {
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);
  analyser.getByteFrequencyData(dataArray);

  const volume = Math.round(Math.sqrt(dataArray.reduce((sum, val) => sum += val*val, 0) / bufferLength));

  // we won't want the volume visualizer to jitter when the volume is low
  return volume > 10 ? volume : 0;
}

const toggleVolume = (s, p) => {
  started_value = s;
  paused_value = p;

  if (started_value && !paused_value) {
    // TODO move this off the main thread with background audio worklet
    intervalID = setInterval(() => set_value(calculateVolume()), 100);
  } else {
    resetVolume();
  }
}

const resetVolume = () => {
  clearInterval(intervalID);
  set_value(0);
}

const { subscribe } = readable(0, set => {
  set_value = set;

  navigator.mediaDevices.getUserMedia({ audio: true })
  .then(stream => {
    const audioContext = new AudioContext();
    const microphone = audioContext.createMediaStreamSource(stream);
    analyser = audioContext.createAnalyser();
    microphone.connect(analyser);

    // we want the volume to go back to 0 immediately after the sound stops
    // so do not overlap the sample
    analyser.smoothingTimeConstant = 0;

    started.subscribe(s => toggleVolume(s, paused_value));
    paused.subscribe(p => toggleVolume(started_value, p));
  })
  .catch(err => {
    throw new Error('Microphone not accessible due to ' + err);
  });

  return () => { resetVolume(); }
});

export const volume = {
  subscribe
};
