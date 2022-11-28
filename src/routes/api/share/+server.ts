import { error } from '@sveltejs/kit';
import db from '$lib/server/db';
import { customAlphabet } from 'nanoid';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	// Parse request Body into Object
	const body = await request.json();

	// Stringify the object with JSON.stringify()
	const pointString: string = JSON.stringify(body);

	// Generate a unique identifier to match with the points
	const nanoid = customAlphabet(
		'1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
		30
	);
	const id: string = await nanoid();

	try {
		// Prepare the statement
		const stmt = db.prepare(`INSERT INTO points VALUES (?, ?)`);

		// Run the statement
		stmt.run(id, pointString);

		// Return a Response object with the identifier in it
		return new Response(id);

		// We really should never get here
	} catch (error: any) {
		throw error(500, {
			message: 'Internal server error occurred. Please try again.'
		});
	}
};
