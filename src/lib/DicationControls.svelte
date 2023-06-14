<script>
  import { id, name, transcript } from "./transcript";
  import { mediaRecorder } from "./mediaRecorder";
  import { recordings } from "./recordings";
  import { speechRecognition } from "./speechRecognition";
  import { time } from "./time";
  
  let started = false;
  let paused = false;

  const start_dictation = () => {
    started = true;

    $mediaRecorder.start();
    speechRecognition.start();
    time.start();

    name.set(null);
    transcript.set([]);
  }
  const pause_dictation = () => {
    paused = true;

    $mediaRecorder.pause();
    speechRecognition.pause();
    time.pause();
  }
  const resume_dictation = () => {
    paused = false;

    $mediaRecorder.resume();
    speechRecognition.resume();
    time.resume();
  }
  const stop_dictation = () => {
    started = false;
    paused = false;

    $mediaRecorder.stop();
    speechRecognition.stop();
    time.stop();

    $name = prompt("Enter a name for this dictation. Click 'Cancel' to discard dictation", "Recording " + ($recordings.length + 1));
    $id = $name ? crypto.randomUUID() : null;
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
