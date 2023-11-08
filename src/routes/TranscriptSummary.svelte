<script>
  import { formatDate } from '$lib/helpers/format';

  export let transcript;
</script>

<div class="card mt-4 w-full bg-base-100 shadow-md">
  <div class="card-body">
    <h2 class="card-title">
      {transcript.name}
    </h2>
    <h3>
      <span class="text-xs">{formatDate(transcript.date)}</span>
    </h3>
    <a href="/{transcript.id}">
      <div class="flex justify-between">
        <div class="truncate mr-8">
          {transcript.transcript[0]?.text}
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </div>
    </a>
  </div>
</div>
