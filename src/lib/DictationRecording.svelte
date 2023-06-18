<script>
  import DictationTranscript from "./DictationTranscript.svelte";
  import { formatDate, formatTime } from "./helpers/format";
  import { recordings } from "./recordings";

  export let audio;
  export let id;
  export let date;
  export let name;
  export let transcript;

  const transcript2blob = () => new Blob(transcript.map(
    ({start_time, end_time, text}) => `${formatTime(start_time)}\n${text}\n${formatTime(end_time)}\n\n`),
    {type: "text/plain"}
  );
</script>

<section>
  <h2>{name}</h2>
  <p>{formatDate(date)}</p>
  <nav>
    <button on:click={() => recordings.delete(id)}>Delete</button>
    <button>
      <a download={`${name}.txt`} href={URL.createObjectURL(transcript2blob())} type="text/plain">Download transcript</a>
    </button>
    <button>
      <a download href={URL.createObjectURL(audio)} type={audio.type}>Download audio</a>
    </button>
  </nav>
  <audio src={URL.createObjectURL(audio)} controls></audio>
  <DictationTranscript transcript={transcript} />
</section>