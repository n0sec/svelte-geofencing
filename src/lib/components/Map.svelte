<script lang="ts">
	import type { PlotCircle } from '../types/PlotCircle';
	import { onDestroy, onMount } from 'svelte';
	import { browser } from '$app/environment';
	import type { LayerGroup } from 'leaflet';
	import { createEventDispatcher } from 'svelte'; //import Eventdispatcher
	let circleGroup: LayerGroup;
	let map: L.Map;
	let L: typeof import('leaflet');

	let mapElement: HTMLElement;
	export let errorText: string = '';
	export let errorVisible: boolean = false;

	const dispatch = createEventDispatcher();
	onMount(async () => {
		dispatch('maploaded'); //dispatch
		if (browser) {
			L = await import('leaflet');

			let openStreetLayer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
				maxZoom: 19,
				attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
			});

			let googleSat = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
				maxZoom: 19,
				subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
				attribution: '&copy; <a href="http://www.google.com">Google</a>'
			});

			let googleStreets = L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
				maxZoom: 15,
				subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
				attribution: '&copy; <a href="http://www.google.com">Google</a>'
			});

			map = L.map(mapElement, {
				center: [42.614689, -71.324092],
				zoom: 15
			});

			L.control
				.layers(
					{
						'Open Street Map': openStreetLayer,
						'Google Satellite': googleSat,
						'Google Streets': googleStreets
					},
					undefined,
					{
						collapsed: false
					}
				)
				.addTo(map);
			openStreetLayer.addTo(map);
		}
	});

	onDestroy(async () => {
		if (map) {
			console.log('Unloading Leaflet map.');
			map.remove();
		}
	});

	// ?? Really not sure if an array is best here or if we can do this right from the store but ¯\_(ツ)_/¯
	export function clearAll(): void {
		if (browser) {
			// Clear the map
			if (map.hasLayer(circleGroup)) {
				map.removeLayer(circleGroup);
			}
		}
	}

	/**
	 * Draws a circle on the map from the entered coordinates
	 * Sets the view to the coordinates
	 */
	export function plot(point: PlotCircle): void | string {
		const { latitude, longitude, radius, color } = point;

		// FIXME: This isn't properly exporting to the parent
		if (latitude === '' || longitude === '' || radius == '') {
			errorVisible = true;
			return (errorText = 'Invalid coordinates. Please enter a latitude, longitude and radius.');
		}
		// Create a group for the circles
		// We need this so when we clear the map later of layers, we only clear this layer
		circleGroup = L.layerGroup();

		// Draw the circle given the latitude, longitude, color and radius and add it to the map
		L.circle([latitude as number, longitude as number], {
			color: color as string,
			radius: radius as number
		}).addTo(circleGroup);

		// Add the circle to the layer
		map.addLayer(circleGroup);

		// Set the current view to the latitude and longitude
		map.setView([latitude as number, longitude as number]).setZoom(15);
	}

	export function myLocation(): void {
		map.locate({ timeout: 5000, setView: true, maxZoom: 18 }).setZoom(15);
	}
</script>

<div
	id="map"
	class="overflow-hidden md:col-span-3 md:row-span-3 h-[90vh] z-10"
	bind:this={mapElement}
/>
