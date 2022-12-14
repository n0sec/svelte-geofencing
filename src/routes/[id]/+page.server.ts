import type { PageServerLoad } from './$types';
import db from '$lib/server/db';
import { error } from '@sveltejs/kit';

const oneWeek = 604800000;

export const load: PageServerLoad = async ({ params }) => {
	// Select the [id] from the db
	// ? Verbose still prints out here
	const stmt = db.prepare(`SELECT * FROM points WHERE id=(?)`);

	// Get the row for [id]
	// Returns undefined if nothing was found
	const result = stmt.get(params.id);

	// If it doesn't exist, throw a 404
	if (!result) {
		throw error(404, { message: 'Oops! The page you are trying to access does not exist' });
	}

	// If the difference is > 24 hours
	// Delete the record from the db
	// Throw a 500 indicating that the record has been deleted
	// Catch anything else
	if (Date.now() - result.creation_date > oneWeek) {
		try {
			const deleteStmt = db.prepare(`DELETE FROM points WHERE id=(?)`);
			deleteStmt.run(params.id);
		} catch (err) {
			throw error(500, { message: `Some unknown error occurred ${err}` });
		}

		throw error(500, { message: 'The code you are trying to access has expired.' });
	}

	return { result };
};
