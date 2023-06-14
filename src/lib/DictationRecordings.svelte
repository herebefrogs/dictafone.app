<script>
  import { recordings } from "./recordings";
  import DictationRecording from "./DictationRecording.svelte";
</script>

{#each $recordings as recording}
  {#if recording.audio && recording.transcript}
    <DictationRecording {...recording} />
  {/if}
{/each}