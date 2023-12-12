<script>
  import { formatTimestamp } from "$lib/helpers/format";

  export let lines;
  export let autoscroll = false;

  function scroll(p, i) {
    if (autoscroll && i === lines.length - 1) {
      p.scrollIntoView(true);
    }
  }
</script>

<div class="container bg-base-100 p-4 m-0 sm:m-4 rounded-lg shadow-md">
  <h2 class="mb-4">Transcript</h2>
  <div>
    {#each lines as { start_time, end_time, text }, i (start_time)}
    <p use:scroll={i}>
      [{formatTimestamp(start_time)}] {text}
      {#if end_time}
      [{formatTimestamp(end_time)}]
      {/if}
    </p>
    {/each}
  </div>
</div>