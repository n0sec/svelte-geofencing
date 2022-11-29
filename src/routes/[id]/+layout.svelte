<script lang="ts">
	import '$lib/app.css';
	import type { LayoutData, PageData } from './$types';

	export let data: LayoutData;
</script>

<!-- ? error.svelte page doesn't load when using LayoutData if there's an error -->
{#if !data || data == undefined}
	<title>Geolocation - Error</title>
{:else}
	<title>Geolocation - {data.result?.id}</title>
{/if}

<main>
	<slot />
</main>

<style>
	@import url('https://fonts.googleapis.com/css2?family=Roboto&display=swap');
</style>
