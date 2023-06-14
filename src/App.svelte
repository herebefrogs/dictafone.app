<script>
  import DictationControls from './lib/DicationControls.svelte';
  import DictationLanguage from './lib/DictationLanguage.svelte';
  import DictationRecordings from './lib/DictationRecordings.svelte';
  import DictationTimer from './lib/DictationTimer.svelte';
  import DictationTranscript from './lib/DictationTranscript.svelte';
  import DictationVolumeVisualizer from './lib/DictationVolumeVisualizer.svelte';
  import { transcript } from './lib/transcript';
</script>

<main>
  <h1>Dictafone</h1>

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
</main>

<style>
  .controls {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
  }
</style>
