<script lang="ts">
	import { browser } from '$app/environment';
	import { createStore } from '$lib/points';
	import type { PlotCircle } from '$lib/types/PlotCircle';
	import type { LayerGroup } from 'leaflet';
	import { onDestroy, onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import { page } from '$app/stores';
	let L: typeof import('leaflet');

	/* ! VARIABLE DEFINITIONS */

	let map: L.Map;
	let mapElement: HTMLElement;
	let circleGroup: LayerGroup;

	let shareUrl: string;

	let errorVisible = false;

	// Define the values used in the bind for the inputs
	// We need the Union Types here so that it plays nice in the script and in the UI
	// The inputs render
	let latitude: number | string = '';
	let longitude: number | string = '';
	let radius: number | string = '';
	let note: string = '';
	let color: string = '#FF0000';

	// Create the point store
	let pointStore = createStore({ latitude, longitude, radius, note, color }, 'Test');

	// Initialize the plotted points array
	let plottedPoints: PlotCircle[] = [];
	let localStoragePoints: PlotCircle[] = [];

	/***********************************************/

	onMount(async () => {
		if (browser) {
			// Clear local storage on mount
			// This means that the user will need to plot their points over again every time they visit the page
			// This shouldn't be a huge deal since thus really shouldn't be used to plot dozens or hundreds of points
			window.localStorage.clear();
			L = await import('leaflet');

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
		}
	});

	onDestroy(async () => {
		if (map) {
			console.log('Unloading Leaflet map.');
			map.remove();
		}
	});

	function addPoint(point: PlotCircle) {
		plottedPoints = [...plottedPoints, point];
	}

	function getLocalStorageKeys(): PlotCircle[] {
		let points: PlotCircle[] = [];
		if (browser) {
			for (let i = 0; i < window.localStorage.length; i++) {
				let key: string | null = window.localStorage.key(i);
				let point = JSON.parse(window.localStorage.getItem(key?.toString()!) || '');
				points = [...points, point];
			}
		}
		return points;
	}

	/**
	 * Draws a circle on the map from the entered coordinates
	 * Sets the view to the coordinates
	 */
	function plot(): void | string {
		// TODO: Return an error if any of the coordinates are missing
		if (!latitude || !longitude || !radius) {
			console.log('Error: Missing coordinates');
			return;
		} else {
			let plottedPoint: PlotCircle = {
				latitude: latitude as number,
				longitude: longitude as number,
				radius: radius as number,
				note: note,
				color: color
			};

			// Create a group for the circles
			// We need this so when we clear the map later of layers, we only clear this layer
			circleGroup = L.featureGroup();

			// Draw the circle given the latitude, longitude, color and radius and add it to the map
			L.circle([plottedPoint.latitude as number, plottedPoint.longitude as number], {
				color: plottedPoint.color as string,
				radius: plottedPoint.radius as number
			}).addTo(circleGroup);

			// Add the circle to the layer
			map.addLayer(circleGroup);

			// Set the current view to the latitude and longitude
			map.setView([plottedPoint.latitude as number, plottedPoint.longitude as number]).setZoom(15);

			// Add the point to the plottedPoints Array
			// ! We're using this to return in the table for the time being
			addPoint(plottedPoint);

			// Add the point to the store which adds it to Local Storage
			// Then refresh the localStoragePoints with what is in localStorage
			// ?? Not sure this is the best way
			plottedPoints.forEach((point, index) => {
				pointStore.set(index.toString(), point);
				localStoragePoints = getLocalStorageKeys();
			});

			// console.log(`Plotted Points: ${JSON.stringify(plottedPoints)}`);
			// console.log(`Local Storage: ${JSON.stringify(localStoragePoints)}`);
		}
	}

	/**
	 * Resets the form
	 */
	function resetForm(): void {
		latitude = '';
		longitude = '';
		radius = '';
		note = 'None';
		color = '#ff0000'; // Leave this red as the default
	}

	// ?? Really not sure if an array is best here or if we can do this right from the store but ¯\_(ツ)_/¯
	function clearAll(): void {
		// Clear localStorage which should theoretically clear the store too lol
		if (browser) {
			window.localStorage.clear();
			localStoragePoints = [];
			if (map.hasLayer(circleGroup)) {
				map.removeLayer(circleGroup);
			}
		}

		// Reset the form while we're at it for accessibility
		resetForm();
	}

	function myLocation(): void {
		map.locate({ timeout: 5000, setView: true, maxZoom: 18 }).setZoom(15);
	}

	function handleCloseError(event: any) {
		let key = event.key;
		if (key == 'Esc') {
			errorVisible = false;
		}
	}

	async function share() {
		const response = await fetch('/api/share', {
			method: 'POST',
			body: JSON.stringify(localStoragePoints),
			headers: {
				'content-type': 'application/json'
			}
		});

		shareUrl = await response.text();
		console.log(shareUrl);
	}
</script>

<!-- TODO: Implement error -->
{#if errorVisible}
	<div
		class="error-banner pl-6 mb-6 ml-6 mr-6 h-14 bg-red-500/80 border-l-4 flex items-center justify-between border-red-400/70"
		transition:fade={{ duration: 300 }}
		on:keydown={handleCloseError}
	>
		<p class="text-sm inline-flex error">
			<svg viewBox="0 0 24 24" class="h-5 w-5 mr-3"
				><path
					fill="currentColor"
					d="M12 17q.425 0 .713-.288Q13 16.425 13 16t-.287-.713Q12.425 15 12 15t-.712.287Q11 15.575 11 16t.288.712Q11.575 17 12 17Zm-1-4h2V7h-2Zm1 9q-2.075 0-3.9-.788q-1.825-.787-3.175-2.137q-1.35-1.35-2.137-3.175Q2 14.075 2 12t.788-3.9q.787-1.825 2.137-3.175q1.35-1.35 3.175-2.138Q9.925 2 12 2t3.9.787q1.825.788 3.175 2.138q1.35 1.35 2.137 3.175Q22 9.925 22 12t-.788 3.9q-.787 1.825-2.137 3.175q-1.35 1.35-3.175 2.137Q14.075 22 12 22Z"
				/></svg
			>
			{$page?.error?.message}
		</p>
		<button on:click={() => (errorVisible = false)}>
			<svg viewBox="0 0 24 24" class="fill-neutral-100 cursor-pointer mr-6 h-5 w-5"
				><path
					d="M6.4 19L5 17.6l5.6-5.6L5 6.4L6.4 5l5.6 5.6L17.6 5L19 6.4L13.4 12l5.6 5.6l-1.4 1.4l-5.6-5.6Z"
				/></svg
			>
		</button>
	</div>
{/if}
<div
	class="md:grid md:grid-cols-5 md:grid-rows-3 md:grid-flow-dense h-screen md:gap-x-6 md:gap-y-16 mx-6"
>
	<form class="col-span-1 col-start-1 row-span-1 justify-self-center">
		<div class="rounded-md shadow-sm">
			<label for="latitude" class="text-sm font-medium text-gray-400 block">Latitude:</label>
			<input
				type="number"
				bind:value={latitude}
				id="latitude"
				name="latitude"
				placeholder="28.582816"
				class="rounded-md shadow-sm text-sm py-1 w-full text-neutral-700 hover:ring-1 focus:ring-1 ring-gray-500"
				required
			/>
		</div>

		<div class="rounded-md shadow-sm mt-3">
			<label for="longitude" class="text-sm font-medium text-gray-400 block">Longitude:</label>
			<input
				type="number"
				bind:value={longitude}
				id="longitude"
				name="longitude"
				placeholder="-81.339941"
				class="rounded-md shadow-sm text-sm py-1 w-full text-neutral-700 hover:ring-1 focus:ring-1 ring-gray-500"
				required
			/>
		</div>

		<div class="rounded-md shadow-sm mt-3">
			<label for="radius" class="text-sm font-medium text-gray-400 block">Radius:</label>
			<input
				type="number"
				bind:value={radius}
				id="radius"
				name="radius"
				placeholder="200"
				class="rounded-md shadow-sm text-sm py-1 w-full text-neutral-700 hover:ring-1 focus:ring-1 ring-gray-500"
				required
			/>
		</div>

		<div class="rounded-md shadow-sm mt-3">
			<label for="note" class="text-sm font-medium text-gray-400 block">Note:</label>
			<input
				type="text"
				bind:value={note}
				id="note"
				name="note"
				placeholder="Known Place"
				class="rounded-md shadow-sm text-sm py-1 w-full text-neutral-700 hover:ring-1 focus:ring-1 ring-gray-500"
			/>
		</div>

		<div class="rounded-md shadow-sm mt-3">
			<label for="color" class="text-sm font-medium text-gray-400 block">Color:</label>
			<input
				type="color"
				bind:value={color}
				id="color"
				name="color"
				class="rounded-md shadow-sm text-sm px-3 py-1 w-full text-neutral-700 hover:ring-1 focus:ring-1 ring-gray-500"
			/>
		</div>
	</form>
	<div class="col-start-2 row-span-1">
		<button
			type="submit"
			on:click={plot}
			value="Plot"
			class="bg-gray-600 rounded-lg text-sm shadow-sm hover:bg-gray-700 focus:ring-gray-300 focus:ring-2 p-2.5 w-full mt-3 cursor-pointer"
			>Plot</button
		>
		<button
			type="button"
			on:click={myLocation}
			value="My Location"
			name="myLocation"
			class="bg-gray-600 rounded-lg text-sm shadow-sm hover:bg-gray-700 focus:ring-gray-300 focus:ring-2 p-2.5 w-full mt-6 cursor-pointer"
			>My Location</button
		>

		<button
			type="button"
			on:click={resetForm}
			value="Reset Form"
			name="resetForm"
			class="bg-gray-600 rounded-lg text-sm shadow-sm hover:bg-gray-700 focus:ring-gray-300 focus:ring-2 p-2.5 w-full mt-6 cursor-pointer"
			>Reset Form</button
		>
		<button
			type="button"
			on:click={clearAll}
			value="Clear All"
			name="clearAll"
			class="bg-gray-600 rounded-lg text-sm shadow-sm hover:bg-gray-700 focus:ring-gray-300 focus:ring-2 p-2.5 w-full mt-6 cursor-pointer"
			>Clear All</button
		>
		<button
			type="button"
			on:click={share}
			value="Share"
			name="share"
			class="bg-blue-500 rounded-lg text-sm text-center shadow-sm hover:bg-blue-600 focus:ring-blue-400 focus:ring-2 py-2.5 w-full mt-6 cursor-pointer"
		>
			<svg viewBox="0 0 24 24" class="mr-2 w-4 h-4 inline" role="img"
				><path
					fill="currentColor"
					d="M18 22q-1.25 0-2.125-.875T15 19q0-.175.025-.363q.025-.187.075-.337l-7.05-4.1q-.425.375-.95.587Q6.575 15 6 15q-1.25 0-2.125-.875T3 12q0-1.25.875-2.125T6 9q.575 0 1.1.212q.525.213.95.588l7.05-4.1q-.05-.15-.075-.337Q15 5.175 15 5q0-1.25.875-2.125T18 2q1.25 0 2.125.875T21 5q0 1.25-.875 2.125T18 8q-.575 0-1.1-.213q-.525-.212-.95-.587L8.9 11.3q.05.15.075.337Q9 11.825 9 12t-.025.362q-.025.188-.075.338l7.05 4.1q.425-.375.95-.588Q17.425 16 18 16q1.25 0 2.125.875T21 19q0 1.25-.875 2.125T18 22Z"
				/></svg
			>Share</button
		>
	</div>

	<div class="overflow-x-auto relative col-start-1 col-span-2 self-start border border-gray-400">
		<table class="w-full text-sm table-auto border-collapse text-left">
			<thead class="uppercase text-xs bg-gray-600">
				<tr>
					<th class="py-2 px-6" scope="col">Latitude</th>
					<th class="py-2 px-6" scope="col">Longitude</th>
					<th class="py-2 px-6" scope="col">Radius</th>
					<th class="py-2 px-6" scope="col">Note</th>
					<th class="py-2 px-6" scope="col">Color</th>
					<th />
				</tr>
			</thead>
			<tbody class="text-sm">
				<!-- TODO: Obtain points from localStorage and not the array -->
				{#each localStoragePoints as { latitude, longitude, radius, note, color }}
					<tr class="text-sm bg-gray-700 hover:bg-gray-800">
						<td class="py-3 px-6">{latitude}</td>
						<td class="py-3 px-6">{longitude}</td>
						<td class="py-3 px-6">{radius}</td>
						<td class="py-3 px-6">{note ?? 'None'}</td>
						<td class="py-3 px-6">{color}</td>
						<td>
							<!-- TODO: Implement on:click handler -->
							<button class="align-middle ">
								<svg viewBox="0 0 24 24" class="fill-red-500 cursor-pointer h-5 w-5"
									><path
										d="M6.4 19L5 17.6l5.6-5.6L5 6.4L6.4 5l5.6 5.6L17.6 5L19 6.4L13.4 12l5.6 5.6l-1.4 1.4l-5.6-5.6Z"
									/></svg
								>
							</button></td
						>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
	<div id="map" class="overflow-hidden col-span-3 row-span-3" bind:this={mapElement} />
</div>
