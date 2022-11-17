import { error, json } from '@sveltejs/kit';
import db from '$lib/db';
import hash from 'object-hash';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	// Parse request Body into Object
	const pointJson = await request.json();

	// Stringify the object with JSON.stringify()
	const pointString: string = JSON.stringify(pointJson);

	// Hash the object using object-hash
	const pointHash: string = hash.sha1(pointJson);

	// Prepare the statement
	const stmt = db.prepare(`INSERT INTO points VALUES (?, ?)`);

	// Run the statement
	stmt.run(pointHash, pointString);

	// TODO: Create the new URL and return that instead

	// Return a Response object with the hash in it
	return new Response(pointHash);
};
