import { writable } from 'svelte/store';
import type { PlotCircle } from './types/PlotCircle';

export function createStore(initialData: PlotCircle, key: string) {
	const data = window.localStorage.getItem(key);

	if (data) {
		initialData = JSON.parse(data);
	}

	const { subscribe, set: _set, update: _update } = writable(initialData);

	return {
		subscribe,

		set(value: PlotCircle) {
			window.localStorage.setItem(key, JSON.stringify(value));
			_set(value);
		}
	};
}
