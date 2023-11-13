<script>
  import { formatTimestamp } from "$lib/helpers/format";

  export let lines;
</script>

{#each lines as line}
<p>
  [{formatTimestamp(line.start_time)}] {line.text}
  {#if line.end_time}
    [{formatTimestamp(line.end_time)}]
  {/if}
</p>
{/each}