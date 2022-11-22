<script lang="ts">
	import Close from '$lib/components/Close.svelte';
	import copy from 'copy-to-clipboard';

	export let identifier: string;
	export let visible: boolean;
</script>

<div class="relative z-20" aria-labelledby="modal-title" role="dialog" aria-modal="true">
	<!--
      Background backdrop, show/hide based on modal state.
  
      Entering: "ease-out duration-300"
        From: "opacity-0"
        To: "opacity-100"
      Leaving: "ease-in duration-200"
        From: "opacity-100"
        To: "opacity-0"
    -->
	<div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />

	<div class="fixed inset-0 z-10 overflow-y-auto">
		<div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
			<!--
          Modal panel, show/hide based on modal state.
  
          Entering: "ease-out duration-300"
            From: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            To: "opacity-100 translate-y-0 sm:scale-100"
          Leaving: "ease-in duration-200"
            From: "opacity-100 translate-y-0 sm:scale-100"
            To: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
        -->
			<div
				class="relative transform overflow-hidden rounded-lg bg-gray-700 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg"
			>
				<div class="bg-gray-700 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
					<div class="sm:flex sm:items-start">
						<div
							class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10"
						>
							<!-- Heroicon name: outline/exclamation-triangle -->
							<svg class="h-6 w-6 text-green-500/80" viewBox="0 0 24 24"
								><path
									fill="currentColor"
									d="m10.6 16.6l7.05-7.05l-1.4-1.4l-5.65 5.65l-2.85-2.85l-1.4 1.4ZM12 22q-2.075 0-3.9-.788q-1.825-.787-3.175-2.137q-1.35-1.35-2.137-3.175Q2 14.075 2 12t.788-3.9q.787-1.825 2.137-3.175q1.35-1.35 3.175-2.138Q9.925 2 12 2t3.9.787q1.825.788 3.175 2.138q1.35 1.35 2.137 3.175Q22 9.925 22 12t-.788 3.9q-.787 1.825-2.137 3.175q-1.35 1.35-3.175 2.137Q14.075 22 12 22Z"
								/></svg
							>
						</div>
						<div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
							<h3 class="text-lg font-medium leading-6 " id="modal-title">Success!</h3>
							<button on:click={() => (visible = false)}>
								<Close class="h-5 w-5 cursor-pointer absolute top-3 right-3" />
							</button>
							<div class="">
								<p class="text-sm ">
									You have successfully saved your plotted points. Copy the below identifier and
									provide this to Support for troubleshooting.
								</p>
							</div>
							<div class="flex items-baseline justify-between">
								<input
									type="text"
									name="identifier"
									id="identifier"
									bind:value={identifier}
									class="mt-3 w-full text-gray-700 pl-3 text-sm"
									disabled
								/>
								<!-- TODO: Implement way to indicate that the text has been selected -->
								<button
									class="w-auto ml-3 uppercase font-medium text-sm shadow-sm bg-blue-500 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 py-2"
									on:click={() => copy(identifier)}>Copy</button
								>
							</div>
						</div>
					</div>
				</div>
				<div class="bg-gray-700/60 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
					<button
						type="button"
						on:click={() => (visible = false)}
						class="inline-flex w-full justify-center rounded-md bg-blue-500 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 sm:ml-3 sm:w-auto sm:text-sm"
						>OK</button
					>
				</div>
			</div>
		</div>
	</div>
</div>
