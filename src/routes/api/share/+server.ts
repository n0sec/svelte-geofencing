import { error, json } from '@sveltejs/kit';
import db from '$lib/db';
import hash from 'object-hash';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	const jsonResponse = await request.json();
	const pointJson = JSON.parse(jsonResponse);

	const pointHash = hash.sha1(pointJson);
	const stmt = db.prepare(`INSERT INTO points VALUES ('${pointHash}', '${pointJson}')`);
	stmt.run();

	return new Response(pointHash);
};
