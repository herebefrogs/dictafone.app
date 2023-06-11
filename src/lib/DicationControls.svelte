<script>
  import { speechRecognition } from "./speechRecognition";
  import { time } from "./time";
  import { transcript } from "./transcript";
  
  let started = false;
  let paused = false;

  const start_dictation = () => {
    started = true;
    speechRecognition.start();
    time.start();
    transcript.set([]);
  }
  const pause_dictation = () => {
    paused = true;
    speechRecognition.pause();
    time.pause();
  }
  const resume_dictation = () => {
    paused = false;
    speechRecognition.resume();
    time.resume();
  }
  const stop_dictation = () => {
    started = false;
    paused = false;
    speechRecognition.stop();
    time.stop();
  }
</script>

<section>
  <button on:click={start_dictation}  class:hidden={started}>Start</button>
  <button on:click={pause_dictation}  class:hidden={!started || paused}>Pause</button>
  <button on:click={resume_dictation} class:hidden={!paused}>Resume</button>
  <button on:click={stop_dictation}   class:hidden={!started}>Stop</button>
</section>

<style>
  .hidden {
    display: none;
  }
</style>
