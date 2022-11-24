<script lang="ts">
	import type { PageData } from './$types';
	import Map from '$lib/components/Map.svelte';
	import type { SvelteComponentTyped } from 'svelte';

	export let data: PageData;

	let points = JSON.parse(data.result.point_string);

	let mapRef: SvelteComponentTyped;
	let errorText: string;
</script>

<Map bind:this={mapRef} />
