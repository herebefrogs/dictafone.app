<script>
	import '../app.postcss';
	import { messages } from '$lib/messages';
	import Alert from '$lib/components/Alert.svelte';
</script>

<navbar class="navbar bg-neutral text-neutral-content shadow-md sticky top-0">
	<div class="navbar-start"></div>
  <div class="navbar-center">
    <a href="/" class="btn btn-ghost normal-case text-xl">Dictafone</a>
  </div>
	<div class="navbar-end"></div>
</navbar>

<div class="container mx-auto">
	{#if $messages.error}
	<Alert message="{$messages.error}" klass="mt-8" />
	{/if}

	<slot />
</div>
