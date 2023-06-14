<script>
  import DictationTranscript from "./DictationTranscript.svelte";
  import { formatDate } from "./helpers/format";

  export let audio;
  export let transcript;
  export let date;
  export let name;
</script>

<section>
  <h2>{name}</h2>
  <p>{formatDate(date)}</p>
  <audio src={URL.createObjectURL(audio)} controls></audio>
  <DictationTranscript transcript={transcript} />
</section>