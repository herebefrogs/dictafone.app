import { findRecording, saveRecording } from "./storage.js";

export class Recorder extends EventTarget {
  #recodingName;
  #recorder;

  // public interface
  constructor() {
    super();
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error('MediaDevices or getUserMedia() not supported on this browser.');
    }

    navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
      this.#recorder = new MediaRecorder(stream);

      this.#recorder.ondataavailable = this.#onDataAvailable.bind(this);
    })
    .catch(err => {
      throw new Error('Microphone not accessible due to ' + err);
    });
  }

  start() {
    this.#recodingName = undefined;
    this.#recorder.start();
  }

  pause() {
    this.#recorder.pause();
  }

  resume() {
    this.#recorder.resume();
  }

  stop(name) {
    this.#recodingName = name;
    this.#recorder.stop();
  }

  // private event handlers
  async #onDataAvailable(event) {
    const audio = event.data;

    const recording = findRecording(this.#recodingName);
    recording.audio = audio;
    recording.size = audio.size;
    recording.type = audio.type;
    recording.date = Date.now();
    await saveRecording(recording);
    
    this.dispatchEvent(new CustomEvent('recording_finalized', { detail: { recording } }));
    
    this.#recodingName = undefined;
  }
}
