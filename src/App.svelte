<script>
  import DictationControls from './lib/DicationControls.svelte';
  import DictationLanguage from './lib/DictationLanguage.svelte';
  import DictationTimer from './lib/DictationTimer.svelte';
  import DictationTranscript from './lib/DictationTranscript.svelte';
</script>

<main>
  <h1>Dictafone</h1>

  <DictationLanguage/>
  <DictationControls/>
  <DictationTimer/>
  <DictationTranscript/>
</main>

<style>
</style>
