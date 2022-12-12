import { error } from '@sveltejs/kit';
import db from '$lib/server/db';
import { customAlphabet } from 'nanoid';
import type { RequestHandler } from './$types';

const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 15);

export const POST: RequestHandler = async ({ request }) => {
	// Parse request Body into Object
	const body = await request.json();

	// Generate a unique identifier to match with the points
	const id: string = await nanoid();

	// Generate the creation_date column using Date
	// Uses Unix time
	// ! This will break in 2038
	const now: number = Date.now();

	try {
		// Prepare the statement
		const stmt = db.prepare(`INSERT INTO points VALUES (?, ?, ?)`);

		// Run the statement
		stmt.run(id, JSON.stringify(body), now);

		// Return a Response object with the identifier in it
		return new Response(id);

		// We really should never get here
	} catch (error: any) {
		throw error(500, {
			message: 'Internal server error occurred. Please try again.'
		});
	}
};
