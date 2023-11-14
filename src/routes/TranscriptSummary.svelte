<script>
  import { formatDate } from '$lib/helpers/format';

  export let transcript;
</script>

<div class="container my-4 p-4 bg-base-100 rounded-lg shadow-md">
  <h2 class="text-xl font-bold capitalize">
    {transcript.name}
  </h2>
  <h3 class="mb-2">
    <span class="text-xs">{formatDate(transcript.date)}</span>
  </h3>
  <a href="/{transcript.id}">
    <div class="flex justify-between">
      <div class="truncate mr-8 capitalize-one">
        {transcript.lines[0]?.text}
      </div>
      <button class="btn text-primary">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </button>
    </div>
  </a>
</div>

<style>
  .capitalize-one::first-letter {
    text-transform: capitalize;
  }
</style>