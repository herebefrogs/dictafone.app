<script>
  import { formatTime } from "./helpers/format";

  export let transcript;
</script>

<section>
  {#each transcript as line}
    <ul>
      <li>{formatTime(line.start_time)}</li>
      <li>{line.text}</li>
      {#if line.end_time}
        <li>{formatTime(line.end_time)}</li>
      {/if}
    </ul>
  {/each}
</section>

<style>
  section {
    text-align: left;
  }
  ul, li {
    list-style: none;
  }
</style>