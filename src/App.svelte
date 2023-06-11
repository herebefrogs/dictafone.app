<script>
  import DictationControls from './lib/DicationControls.svelte';
  import DictationLanguage from './lib/DictationLanguage.svelte';
  import DictationTimer from './lib/DictationTimer.svelte';
  import DictationTranscript from './lib/DictationTranscript.svelte';
</script>

<main>
  <h1>Dictafone</h1>

  <section class="controls">
    <DictationLanguage/>
    <DictationControls/>
    <DictationTimer/>
  </section>
  <DictationTranscript/>
</main>

<style>
  .controls {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
  }
</style>
