<script>
	import '../app.postcss';
	import { messages } from '$lib/messages';
</script>

<navbar class="navbar bg-base-100 shadow sticky top-0">
	<div class="navbar-start"></div>
  <div class="navbar-center">
    <a href="/" class="btn btn-ghost normal-case text-xl">Dictafone</a>
  </div>
	<div class="navbar-end"></div>
</navbar>

<div class="container mx-auto">
	{#if $messages.error}
	<div class="alert alert-error">
		<svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
		<span>Error! {$messages.error}</span>
	</div>
	{/if}

	<slot />
</div>
