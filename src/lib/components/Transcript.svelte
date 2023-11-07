<script>
  import { formatTime } from "$lib/helpers/format";

  export let transcript;
</script>

{#each transcript as line}
<p>
  [{formatTime(line.start_time)}] {line.text}
  {#if line.end_time}
    [{formatTime(line.end_time)}]
  {/if}
</p>
{/each}