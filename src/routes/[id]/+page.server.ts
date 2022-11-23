import type { PageServerLoad } from './$types';
import db from '$lib/server/db';

export const load: PageServerLoad = async ({ params }) => {
	try {
		const stmt = db.prepare(`SELECT * FROM points WHERE id=(?)`);
		const result = stmt.get(params.id);
		console.log(result);
		return {
			result: result
		};
	} catch (err) {
		console.log(err);
	}
};
