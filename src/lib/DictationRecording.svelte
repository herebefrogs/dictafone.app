<script>
  import DictationTranscript from "./DictationTranscript.svelte";
  import { formatDate } from "./helpers/format";
  import { recordings } from "./recordings";

  export let audio;
  export let id;
  export let date;
  export let name;
  export let transcript;
</script>

<section>
  <h2>{name}</h2>
  <p>{formatDate(date)} <button on:click={() => recordings.delete(id)}>Delete</button></p>
  <audio src={URL.createObjectURL(audio)} controls></audio>
  <DictationTranscript transcript={transcript} />
</section>