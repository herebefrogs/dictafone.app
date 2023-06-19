<script>
  import DictationControls from './lib/DicationControls.svelte';
  import DictationLanguage from './lib/DictationLanguage.svelte';
  import DictationRecordings from './lib/DictationRecordings.svelte';
  import DictationTimer from './lib/DictationTimer.svelte';
  import DictationTranscript from './lib/DictationTranscript.svelte';
  import DictationVolumeVisualizer from './lib/DictationVolumeVisualizer.svelte';
  import { error } from './lib/error';
  import { mediaRecorder } from './lib/mediaRecorder';
  import { volume } from './lib/microphoneVolume';
  import { speechRecognition } from './lib/speechRecognition';
  import { transcript } from './lib/transcript';
</script>

<main>
  <h1>Dictafone</h1>

  {#if $error}
    <p class="error">{$error}</p>
  {/if}
  {#if speechRecognition && mediaRecorder && $volume !== null}
    <section>
      <nav class="controls">
        <DictationLanguage/>
        <DictationControls/>
        <DictationVolumeVisualizer/>
        <DictationTimer/>
      </nav>
      <DictationTranscript transcript={$transcript}/>
    </section>
    <DictationRecordings/>
  {/if}
</main>

<style>
  .controls {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
  }
  .error {
    background-color: #FFCDD2; /* Material Design Red 50 100 */
  }
</style>
