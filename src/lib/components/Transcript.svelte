<script>
  import { formatTime } from "$lib/helpers/format";

  export let transcript;
</script>

<div class="card w-full bg-base-100 shadow my-4 overflow-y-auto">
  <div class="card-body font-sans">
    {#each transcript as line}
    <p>
      {formatTime(line.start_time)} {line.text}
      {#if line.end_time}
        {formatTime(line.end_time)}
      {/if}
    </p>
    {/each}
    </div>
</div>