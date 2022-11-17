import { error } from '@sveltejs/kit';
import db from '$lib/db';
import hash from 'object-hash';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	if (!request.body) {
		throw error(400, 'Request body not found. Please try again.');
	}

	// Parse request Body into Object
	const pointJson = await request.json();

	// Stringify the object with JSON.stringify()
	const pointString: string = JSON.stringify(pointJson);

	// Hash the object using object-hash
	const pointHash: string = hash(pointJson, { algorithm: 'md5' });
	const newUrl = `${request.url}/${pointHash}`;
	console.log(newUrl);

	try {
		// Prepare the statement
		const stmt = db.prepare(`INSERT INTO points VALUES (?, ?)`);

		// Run the statement
		stmt.run(pointHash, pointString);
	} catch (error: any) {
		throw error(500, 'Something went wrong with the request. Please try the request again.');
	}

	// Return a Response object with the hash in it
	return new Response(newUrl);

	// TODO: Create the new URL and return that instead
};
