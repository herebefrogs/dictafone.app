<script>
  import { browser } from '$app/environment';
  import { goto } from '$app/navigation';
  import { fireEvent } from '$lib/helpers/analytics';
  import Alert from '$lib/components/Alert.svelte';
  import { id, audio, name, lines } from '$lib/stores/transcript';
  import { transcripts } from '$lib/stores/persistence';
  import { time } from './time';


  let error = null;

  const save = async e => {
    if ($name) {
      $id = crypto.randomUUID();
      try {
        await transcripts.insert({
          id: $id,
          audio: $audio,
          date: Date.now(),
          duration: $time,
          lines: $lines,
          name: $name,
        })
        fireEvent('transcript_save', { audio: $audio, duration: $time, lines: $lines });
        name_modal.close();
      } catch (msg) {
        error = msg;
        e.preventDefault();
      }
    } else {
      error = 'Transcript name can\'t be empty.';
      e.preventDefault();
    }
  }

  const keydown = e => {
    if (e.key === 'Enter') {
      save(e);
    }
  }

  const close = async () => {
    error = false;
    if (browser) {
      if (!$id) {
        fireEvent('transcript_abort', { audio: $audio, duration: $time, lines: $lines });
      }
      await goto($id ? `/${$id}` : '/');
    }
  }
</script>

<dialog id="name_modal" class="modal" on:close={close}>
  <div class="modal-box">
    <h3 class="font-bold text-lg">Save Transcript</h3>
    <input bind:value={$name} on:keydown={keydown} type="text" placeholder="Enter a transcript name" class="input input-bordered w-full max-w-xs my-4" />

    {#if error}
    <Alert message={error} klass="w-full max-w-xs mb-8" />
    {/if}

    <p class="my-4">Pressing ESC will delete this transcript.</p>

    <div class="modal-action">
      <form method="dialog">
        <button class="btn">
          Delete
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
          </svg>
        </button>
        <button class="btn text-primary" on:click={save}>
          Save
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>          
        </button>
      </form>
    </div>
  </div>
</dialog>