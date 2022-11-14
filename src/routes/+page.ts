import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import type { PlotCircle } from '$lib/types/PlotCircle';
import { browser } from '$app/environment';

export const load: PageLoad = ({}) => {
	let points: PlotCircle[] = [];
	if (browser) {
		for (let i = 0; i < window.localStorage.length; i++) {
			let key: string | null = window.localStorage.key(i);
			let point = JSON.parse(window.localStorage.getItem(key?.toString()!) || '');
			points = [...points, point];
		}
	}

	return {
		points: points
	};
};
