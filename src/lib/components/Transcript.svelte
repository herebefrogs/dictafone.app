<script>
  import { formatTimestamp } from "$lib/helpers/format";

  export let lines;
</script>

<div class="container bg-base-100 p-4 m-0 sm:m-4 rounded-lg shadow-md">
  <h2 class="mb-4">Transcript</h2>
  {#each lines as line}
  <p>
    [{formatTimestamp(line.start_time)}] {line.text}
    {#if line.end_time}
    [{formatTimestamp(line.end_time)}]
    {/if}
  </p>
  {/each}
</div>