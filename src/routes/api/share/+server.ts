import { error } from '@sveltejs/kit';
import db from '$lib/server/db';
import { customAlphabet } from 'nanoid';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	if (!request.body) {
		throw error(400, 'Request body not found. Please try again.');
	}

	// Parse request Body into Object
	const pointJson = await request.json();

	// Stringify the object with JSON.stringify()
	const pointString: string = JSON.stringify(pointJson);

	// Generate a unique identifier to match with the points
	const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 30);
	const id: string = await nanoid();

	try {
		// Prepare the statement
		const stmt = db.prepare(`INSERT INTO points VALUES (?, ?)`);

		// Run the statement
		stmt.run(id, pointString);

		// We really should never get here
	} catch (error: any) {
		throw error(500, 'Something went wrong with the request. Please try the request again.');
	}

	// Return a Response object with the identifier in it
	return new Response(id);
};
