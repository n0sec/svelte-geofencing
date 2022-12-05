<script lang="ts">
	import { page } from '$app/stores';
	import '$lib/app.css';
</script>

<div class="container mx-auto flex justify-center flex-col h-screen items-center">
	<h1 class="text-9xl">{$page.status}</h1>
	<p class="text-neutral-100/50 text-2xl mt-4">{$page.error?.message}</p>
	<button
		class="button uppercase p-5 mt-6 rounded-lg shadow-md bg-gray-600 hover:bg-gray-700 font-semibold"
		type="button"><a href="/">Go Home</a></button
	>
</div>
