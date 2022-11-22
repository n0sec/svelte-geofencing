import type { PageServerLoad } from './$types';
import db from '$lib/server/db';

export const load: PageServerLoad = async ({ params }) => {
	try {
		const stmt = db.prepare(`SELECT id FROM points WHERE id=(?)`);
		const result = stmt.run(params.id);
		console.log(result);
		return {
			id: result
		};
	} catch (err) {
		console.log(err);
	}
};
