<script lang="ts">
	import { browser } from '$app/environment';
	import { createStore } from '$lib/points';
	import type { PlotCircle } from '$lib/types/PlotCircle';
	import { onMount, SvelteComponentTyped } from 'svelte';
	import { fade } from 'svelte/transition';
	import Modal from '$lib/components/Modal.svelte';
	import Map from '$lib/components/Map.svelte';
	import Spinner from '$lib/components/Spinner.svelte';
	import { error } from '@sveltejs/kit';

	/* ! VARIABLE DEFINITIONS */
	let mapRef: SvelteComponentTyped;
	let errorVisible = false;
	let errorText: string;

	let pointIdentifier: string;
	let modalVisible: boolean = false;
	let inputsDisabled: boolean = false;

	// Define the values used in the bind for the inputs
	// We need the Union Types here so that it plays nice in the script and in the UI
	// The inputs render
	let latitude: number | string = '';
	let longitude: number | string = '';
	let radius: number | string = '';
	let note: string = '';
	let color: string = '#FF0000';

	// Create the point store
	let pointStore = createStore<PlotCircle>(
		[{ latitude, longitude, radius, note, color }],
		'points'
	);
	let load: boolean = false;
	/***********************************************/

	onMount(() => {
		// Clear store on mount
		// This means that the user will need to plot their points over again every time they visit the page
		// This shouldn't be a huge deal since this really shouldn't be used to plot dozens or hundreds of points
		pointStore.clear();
	});

	function addToStore(point: PlotCircle) {
		console.log(`add to store: ${point}`);
		pointStore.add(point);
	}

	function plotLatestPoint(points: PlotCircle[]) {
		if (points.length == 0) {
			return;
		}
		const point = points[points.length - 1];
		mapRef.plot(point);
	}

	$: browser && mapRef && plotLatestPoint($pointStore);

	/**
	 * Resets the form
	 */
	function resetForm(): void {
		latitude = '';
		longitude = '';
		radius = '';
		note = '';
		color = '#ff0000'; // Leave this red as the default
	}

	function clearAll(): void {
		if (browser) {
			// Clear the store
			pointStore.clear();
			mapRef.clearAll();
		}

		// Reset the form while we're at it for accessibility
		resetForm();

		// Reset the input fields to make them available again in case the user shared what they had
		inputsDisabled = false;
	}

	async function share() {
		// Check if there's anything in the store
		if ($pointStore.length === 0) {
			errorText = 'No points have been plotted! Plot some points first!';
			errorVisible = true;
			return;
		}
		const response = await fetch('/api/share', {
			method: 'POST',
			body: JSON.stringify($pointStore),
			headers: {
				'content-type': 'application/json',
				accept: 'text/html'
			}
		});

		pointIdentifier = await response.text();
		modalVisible = true;
		inputsDisabled = true;
	}
</script>

{#if errorVisible}
	<div
		class="error-banner pl-6 mb-6 ml-6 mr-6 h-14 bg-red-500/80 border-l-4 flex items-center justify-between border-red-400/70"
		transition:fade={{ duration: 300 }}
	>
		<p class="text-sm inline-flex error">
			<svg viewBox="0 0 24 24" class="h-5 w-5 mr-3"
				><path
					fill="currentColor"
					d="M12 17q.425 0 .713-.288Q13 16.425 13 16t-.287-.713Q12.425 15 12 15t-.712.287Q11 15.575 11 16t.288.712Q11.575 17 12 17Zm-1-4h2V7h-2Zm1 9q-2.075 0-3.9-.788q-1.825-.787-3.175-2.137q-1.35-1.35-2.137-3.175Q2 14.075 2 12t.788-3.9q.787-1.825 2.137-3.175q1.35-1.35 3.175-2.138Q9.925 2 12 2t3.9.787q1.825.788 3.175 2.138q1.35 1.35 2.137 3.175Q22 9.925 22 12t-.788 3.9q-.787 1.825-2.137 3.175q-1.35 1.35-3.175 2.137Q14.075 22 12 22Z"
				/></svg
			>
			{errorText}
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
{#if modalVisible}
	<Modal identifier={pointIdentifier} bind:visible={modalVisible} />
{/if}
<div
	class="flex flex-col md:grid md:grid-cols-5 md:grid-rows-2 md:grid-flow-dense md:gap-x-6 md:gap-y-16 mx-6"
>
	<form class="md:col-span-1 md:col-start-1 md:row-span-1 justify-self-center">
		<div class="shadow-sm">
			<label for="latitude" class="text-sm font-medium text-gray-400 block">Latitude</label>
			<input
				type="number"
				bind:value={latitude}
				id="latitude"
				name="latitude"
				placeholder="28.582816"
				disabled={inputsDisabled}
				class="shadow-sm text-sm py-1 w-full text-neutral-700 hover:ring-1 focus:ring-1 ring-gray-500 disabled:opacity-50 placeholder:text-slate-400"
				required
			/>
		</div>

		<div class="shadow-sm mt-3">
			<label for="longitude" class="text-sm font-medium text-gray-400 block">Longitude</label>
			<input
				type="number"
				bind:value={longitude}
				id="longitude"
				name="longitude"
				placeholder="-81.339941"
				disabled={inputsDisabled}
				class="shadow-sm text-sm py-1 w-full text-neutral-700 hover:ring-1 focus:ring-1 ring-gray-500 disabled:opacity-50 placeholder:text-slate-400"
				required
			/>
		</div>

		<div class="shadow-sm mt-3">
			<label for="radius" class="text-sm font-medium text-gray-400 block">Radius</label>
			<input
				type="number"
				bind:value={radius}
				id="radius"
				name="radius"
				placeholder="200"
				disabled={inputsDisabled}
				class="shadow-sm text-sm py-1 w-full text-neutral-700 hover:ring-1 focus:ring-1 ring-gray-500 disabled:opacity-50 placeholder:text-slate-400"
				required
			/>
		</div>

		<div class="shadow-sm mt-3">
			<label for="note" class="text-sm font-medium text-gray-400 block">Note</label>
			<input
				type="text"
				bind:value={note}
				id="note"
				name="note"
				placeholder="Known Place"
				disabled={inputsDisabled}
				class="shadow-sm text-sm py-1 w-full text-neutral-700 hover:ring-1 focus:ring-1 ring-gray-500 disabled:opacity-50 placeholder:text-slate-400"
			/>
		</div>

		<div class="shadow-sm mt-3">
			<label for="color" class="text-sm font-medium text-gray-400 block">Color</label>
			<input
				type="color"
				bind:value={color}
				id="color"
				name="color"
				disabled={inputsDisabled}
				class="shadow-sm text-sm px-3 py-1 w-full text-neutral-700 hover:ring-1 focus:ring-1 ring-gray-500 disabled:opacity-50 placeholder:text-slate-400"
			/>
		</div>
	</form>
	<div class="md:col-start-2 md:row-span-1">
		<button
			type="button"
			on:click={() => addToStore({ latitude, longitude, radius, note, color })}
			value="Plot"
			disabled={inputsDisabled}
			class="bg-gray-600 text-sm uppercase font-bold shadow-sm enabled:hover:bg-gray-700 focus:ring-gray-300 focus:ring-2 p-2.5 w-full mt-3 cursor-pointer disabled:opacity-50"
			>Plot</button
		>
		<button
			type="button"
			on:click={mapRef.myLocation}
			value="My Location"
			disabled={inputsDisabled}
			name="myLocation"
			class="bg-gray-600 text-sm uppercase font-bold shadow-sm enabled:hover:bg-gray-700 focus:ring-gray-300 focus:ring-2 p-2.5 w-full mt-6 cursor-pointer disabled:opacity-50"
			>My Location</button
		>

		<button
			type="button"
			on:click={resetForm}
			value="Reset Form"
			disabled={inputsDisabled}
			name="resetForm"
			class="bg-gray-600 text-sm uppercase font-bold shadow-sm enabled:hover:bg-gray-700 focus:ring-gray-300 focus:ring-2 p-2.5 w-full mt-6 cursor-pointer disabled:opacity-50"
			>Reset Form</button
		>
		<button
			type="button"
			on:click={clearAll}
			value="Clear All"
			name="clearAll"
			class="bg-gray-600 text-sm uppercase font-bold shadow-sm hover:bg-gray-700 focus:ring-gray-300 focus:ring-2 p-2.5 w-full mt-6 cursor-pointer"
			>Clear All</button
		>
		<button
			type="button"
			on:click={share}
			value="Share"
			disabled={inputsDisabled}
			name="share"
			class="bg-blue-600 text-sm uppercase font-bold text-center shadow-sm enabled:hover:bg-blue-700 focus:ring-blue-400 focus:ring-2 py-2.5 w-full mt-6 cursor-pointer disabled:opacity-50"
		>
			<svg viewBox="0 0 24 24" class="mr-2 w-4 h-4 inline" role="img"
				><path
					fill="currentColor"
					d="M18 22q-1.25 0-2.125-.875T15 19q0-.175.025-.363q.025-.187.075-.337l-7.05-4.1q-.425.375-.95.587Q6.575 15 6 15q-1.25 0-2.125-.875T3 12q0-1.25.875-2.125T6 9q.575 0 1.1.212q.525.213.95.588l7.05-4.1q-.05-.15-.075-.337Q15 5.175 15 5q0-1.25.875-2.125T18 2q1.25 0 2.125.875T21 5q0 1.25-.875 2.125T18 8q-.575 0-1.1-.213q-.525-.212-.95-.587L8.9 11.3q.05.15.075.337Q9 11.825 9 12t-.025.362q-.025.188-.075.338l7.05 4.1q.425-.375.95-.588Q17.425 16 18 16q1.25 0 2.125.875T21 19q0 1.25-.875 2.125T18 22Z"
				/></svg
			>Share</button
		>
	</div>

	<!-- * Table Component * -->
	<div
		class="overflow-x-auto overflow-y-auto md:relative md:col-start-1 md:col-span-2 md:self-start border md:-mt-20 mt-6 mb-6 max-h-[14rem] md:max-h-[26rem] border-gray-400"
	>
		<table class="w-full text-sm table-auto border-collapse text-left">
			<thead class="uppercase text-xs bg-gray-600">
				<tr>
					<th class="py-2 px-6" scope="col">Latitude</th>
					<th class="py-2 px-6" scope="col">Longitude</th>
					<th class="py-2 px-6" scope="col">Radius</th>
					<th class="py-2 px-6" scope="col">Note</th>
					<th class="py-2 px-6" scope="col">Color</th>
				</tr>
			</thead>
			<tbody class="text-sm">
				{#each $pointStore as mapPoint}
					{#if mapPoint.latitude != '' || mapPoint.longitude != '' || mapPoint.radius != ''}
						<tr class="text-sm bg-gray-700 hover:bg-gray-800">
							<td class="py-3 px-6">{mapPoint.latitude}</td>
							<td class="py-3 px-6">{mapPoint.longitude}</td>
							<td class="py-3 px-6">{mapPoint.radius}</td>
							<td class="py-3 px-6">{mapPoint.note ?? 'None'}</td>
							<td class="py-3 px-6"
								><div class="w-4 h-4" style:background-color={mapPoint.color} />
								({mapPoint.color})</td
							>
						</tr>
					{/if}
				{/each}
			</tbody>
		</table>
	</div>
	{#if !load}
		<!-- load is by default false as such this renders on page load -->
		<div class="grid col-span-3 place-items-center">
			<Spinner />
		</div>
	{/if}
	<Map bind:this={mapRef} bind:errorText bind:errorVisible on:maploaded={() => (load = true)} />
	<!-- on:maploaded (on load of the map, remove loading html) -->
</div>
