import type { Data } from '$lib/types';
import { error } from '@sveltejs/kit';

export async function load(page) {
	let data: Data | undefined;

	try {
		const response = await page.fetch(
			'https://gist.githubusercontent.com/odere/00d38d2ff49033bdc0d323a770050ff1/raw/afc9c2790efe30403d2808f56ce6670f35a08c45/v2.json'
		);
		data = await response.json();
	} catch (error) {
		console.error(error);
	}

	if (!data) {
		throw error(404);
	}

	return { ...data };
}
