<div
	class="md:px-10 md:w-1/2 md:mx-auto md:tracking-normal md:text-base mx-6 justify-center text-sm tracking-wider align-middle pb-6"
>
	<section>
		<div class="about">
			<h1 class="text-center">About This App</h1>
			<p>
				This app was written to include a way to plot geofenced punches and Known Places from WFD
				and visually see where employees are punching. It uses your browser's <code
					>localStorage</code
				> to store any points plotted while visiting. To get started, continue reading to the following
				sections.
			</p>
			<p>
				This app is best used to troubleshoot and plot WFD Mobile App punches and not punches from a
				laptop or desktop. Geolocation from a laptop or desktop can be innacurate depending on
				several factors.
			</p>
			<div
				class="tooltip h-auto mt-6 bg-red-600/95 border-l-4 relative items-center p-3 border-red-400/90"
			>
				<svg viewBox="0 0 24 24" class="h-5 w-5 mr-3 absolute left-3 top-3"
					><path
						fill="currentColor"
						d="M1 21L12 2l11 19Zm11-3q.425 0 .713-.288Q13 17.425 13 17t-.287-.712Q12.425 16 12 16t-.712.288Q11 16.575 11 17t.288.712Q11.575 18 12 18Zm-1-3h2v-5h-2Z"
					/></svg
				>

				<p class="text-sm info ml-8">
					Manually deleting items from Local Storage will have unintended consequences and may cause
					the app to need to be restarted.
				</p>
			</div>
		</div>
	</section>

	<section>
		<div class="getting-started">
			<h1 class="mt-6 text-center">Getting Started</h1>
			<p>
				Enter the punch data into the provided inputs. The latitude and longitude can be located in
				a Dataview that uses Geolocation columns. These can be found using the "Audit" entity in the
				Data Dictionary.
			</p>
			<ul class="mt-6">
				<li><code>latitude</code> (required) is the Latitude coordinate</li>
				<li><code>longitude</code> (required) is the Longitude coordinate</li>
				<li><code>radius</code> (required) is the Accuracy</li>
				<li>
					<code>Note</code> (optional) is some string identifier for the punch (e.g. "Known Place", "John
					Punch In")
				</li>
				<li>
					<code>Color</code> (optional) is a selectable color that will be used to color the plotted
					circle. The default is red.
				</li>
			</ul>
			<p>
				Once all required fields have been filled out, click <strong>Plot</strong> to draw a circle on
				the map with your specified parameters. A table below the input fields will also be populated
				with the data.
			</p>
			<p>
				Click <strong>Share</strong> to save the plotted points. The code provided can be used to
				share with others or Support for troubleshooting. Provide this ID to anyone you want to
				share with. To access the plotted points, navigate to <code>[/id]</code>.
				<strong>Share codes expire after 24 hours from creation</strong>.
			</p>
			<div
				class="tooltip h-auto mt-6 bg-yellow-400/95 border-l-4 relative items-center p-3 border-yellow-200/90 text-gray-800"
			>
				<svg viewBox="0 0 24 24" class="h-5 w-5 mr-3 absolute"
					><path
						fill="currentColor"
						d="M1 21L12 2l11 19Zm11-3q.425 0 .713-.288Q13 17.425 13 17t-.287-.712Q12.425 16 12 16t-.712.288Q11 16.575 11 17t.288.712Q11.575 18 12 18Zm-1-3h2v-5h-2Z"
					/></svg
				>

				<p class="text-sm info ml-8">
					Clicking the Share button disables further interactivity with the form.
				</p>
			</div>
		</div>
	</section>
</div>
