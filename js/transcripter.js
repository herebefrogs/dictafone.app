export class Transcripter extends EventTarget {
  #recognition
  #lang = 'en-US'
  #lastTime = 0;
  #elapsedTime = 0;
  #transcript = [];

  // public interface
  constructor() {
    super();

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      throw new Error('SpeechRecognition not supported on this browser.');
    }

    this.#recognition = new SpeechRecognition();
    this.#recognition.interimResults = false;
    this.#recognition.maxAlternatives = 1;
    this.#recognition.continuous = true;
    this.#recognition.onresult = this.#onResults.bind(this);
  }

  get lang() {
    return this.#lang;
  }

  set lang(lang) {
    this.#recognition.lang = lang;
    this.#lang = lang;
  }

  start() {
    this.#recognition.start();
    this.#transcript = [];
    this.#lastTime = performance.now();
    this.#elapsedTime = 0;
  }

  pause() {
    this.#recognition.stop();
    this.#elapsedTime += performance.now() - this.#lastTime;
  }

  resume() {
    this.#recognition.start();
    this.#lastTime = performance.now();
  }

  stop() {
    this.#recognition.stop();
    this.#elapsedTime += performance.now() - this.#lastTime;
  }

  get text() {
    return this.#transcript.join('\n');
  }

  // todo: add pause/resume handlers to update elaspedTime and lastTime properly

  // event handlers
  #onResults(event) {
    const result = event.results[event.resultIndex];
  
    if (result.isFinal) {
      const now = performance.now();
      this.#elapsedTime += now - this.#lastTime;
      this.#lastTime = now;
  
      this.#transcript.push(`${this.#formatElapsedTime()} ${result[0].transcript}`);

      this.dispatchEvent(new CustomEvent('transcript_updated', { detail: { text: this.text }}));
    }
  }

  // private helpers
  #formatDigit(d) {
    return d < 10 ? '0' + d : d;
  }
  
  #formatElapsedTime() {
    const time = this.#elapsedTime / 1000;
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time - hours * 3600) / 60);
    const seconds = Math.floor((time - hours * 3600 - minutes * 60))
    return `[${hours ? this.#formatDigit(hours) + ':' : ''}${this.#formatDigit(minutes)}:${this.#formatDigit(seconds)}]`;
  }
  
}