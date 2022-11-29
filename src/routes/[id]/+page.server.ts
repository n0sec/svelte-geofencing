import type { PageServerLoad } from './$types';
import db from '$lib/server/db';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
	// Select the [id] from the db
	// ? Verbose still prints out here
	const stmt = db.prepare(`SELECT * FROM points WHERE id=(?)`);

	// Get the row for [id]
	// Returns undefined if nothing was found
	const result = stmt.get(params.id);

	// If it doesn't exist, throw a 404
	if (!result) {
		throw error(404, {
			message: 'Oops! The page you are trying to access does not exist'
		});
	}

	return {
		result
	};
};
