import { readable } from "svelte/store";


let analyser;
let intervalID;

const { subscribe } = readable(null, set => {
  navigator.mediaDevices.getUserMedia({ audio: true })
  .then(stream => {
    const audioContext = new AudioContext();
    const microphone = audioContext.createMediaStreamSource(stream);
    analyser = audioContext.createAnalyser();
    // we want the volume to go back to 0 immediately after the sound stops
    // so do not overlap the sample
    analyser.smoothingTimeConstant = 0;

    microphone.connect(analyser);

    // TODO move this off the main thread with background audio worklet
    // only update this value when the dictation is started and not paused
    // otherwise it's creepy to see the microphone is always on
    setInterval(() => {
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      analyser.getByteFrequencyData(dataArray);

      const volume = Math.round(Math.sqrt(dataArray.reduce((sum, val) => sum += val*val, 0) / bufferLength));

      set(volume > 10 ? volume : 0);
    }, 100);
  })
  .catch(err => {
    throw new Error('Microphone not accessible due to ' + err);
  });

  return () => { clearInterval(intervalID); }
});

export const volume = {
  subscribe
};
