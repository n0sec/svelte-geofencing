<script lang="ts">
	import type { PageData } from './$types';
	import Map from '$lib/components/Map.svelte';
	import { onDestroy, onMount } from 'svelte';
	import type { PlotCircle } from '$lib/types/PlotCircle';

	export let data: PageData;

	let points = JSON.parse(data.result.point_string);

	let mapElement: HTMLElement;
	let map: L.Map;

	onMount(async () => {
		const L = await import('leaflet');

		let openStreetLayer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
			maxZoom: 19,
			attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
		});

		map = L.map(mapElement, {
			center: [42.614689, -71.324092],
			zoom: 15,
			layers: [openStreetLayer]
		});

		// Create the Layer Names in UI
		let baseMaps = {
			'Open Street Map': openStreetLayer
		};

		L.control.layers(baseMaps).addTo(map);

		points.forEach((point: PlotCircle) => {
			L.circle([point.latitude as number, point.longitude as number], {
				color: point.color as string,
				radius: point.radius as number
			}).addTo(map);
			map.fitWorld();
		});
	});

	onDestroy(async () => {
		if (map) {
			console.log('Unloading Leaflet map.');
			map.remove();
		}
	});
</script>

<!-- <Map bind:this={mapRef} /> -->
<div id="map" class="overflow-hidden h-screen" bind:this={mapElement} />
