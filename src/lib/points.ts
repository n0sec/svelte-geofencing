import { writable } from 'svelte/store';
import type { PlotCircle } from './types/PlotCircle';

export function createStore<T>(initialData: T[], key: string) {
	const data = typeof window !== 'undefined' ? window.localStorage.getItem(key) : null;

	if (data) {
		initialData = JSON.parse(data) as T[];
	}

	const store = writable<T[]>(initialData);

	// Add and update localStorage
	function add(value: T) {
		store.update(($store) => [...$store, value]);
		window.localStorage.setItem(key, JSON.stringify(store));
	}

	// Clear and update localStorage
	function clear() {
		store.set([]);
		window.localStorage.clear();
	}

	return {
		subscribe: store.subscribe,
		add,
		clear
	};
}
