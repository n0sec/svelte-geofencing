<script lang="ts">
	import type { PageData } from './$types';
	import Map from '$lib/components/Map.svelte';
	import { onMount, type SvelteComponentTyped } from 'svelte';
	import { browser } from '$app/environment';
	import type { PlotCircle } from '$lib/types/PlotCircle';

	export let data: PageData;

	let points = JSON.parse(data.result.point_string);

	let mapRef: SvelteComponentTyped | HTMLElement;
	let errorText: string;
	let map: L.Map;

	onMount(async () => {
		if (browser) {
			const L = await import('leaflet');

			map = L.map(mapRef as HTMLElement);

			points.forEach((point: PlotCircle) => {
				L.circle([point.latitude as number, point.longitude as number], {
					color: point.color as string,
					radius: point.radius as number
				}).addTo(map);
				map.fitWorld();
			});
		}
	});
</script>

<Map bind:this={mapRef} />
