import { error } from '@sveltejs/kit';

export async function load(page) {
	const parentData = await page.parent();
	const { data } = parentData || {};
	const imageData = data[page.params.id];

	if (!imageData) throw error(404);

	return { ...imageData };
}
