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

	// Set the number of milliseconds in 24 hours
	const oneDay: number = 86400000;

	// Calculate the difference between when the URL was accessed (now) and the creation_date in the db when the record was created
	const timeDifference: number = Date.now() - result.creation_date;

	// If the difference is > 24 hours
	if (timeDifference > oneDay) {
		// Try to delete from the db
		try {
			const deleteStmt = db.prepare(`DELETE FROM points WHERE id=(?)`);
			deleteStmt.run(params.id);
			// Catch where anything random could go wrong
			// Throw a 500
		} catch (err) {
			throw error(500, {
				message: `Some unknown error occurred ${err}`
			});
		}
		// If the record was deleted successfully, throw a 500 letting the user know the record was deleted
		throw error(500, {
			message: 'The code you are trying to access has expired.'
		});
	}

	return {
		result
	};
};
