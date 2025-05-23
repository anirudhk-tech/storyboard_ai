import { generateImage } from '$lib/services/aiServices';
import { json, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = (async ({ request }) => {
	const { prompt } = await request.json();

	const data = await generateImage(prompt);
	const base64String = data.split(',')[1];
	const mime = 'image/png';
	const src = `data:${mime};base64,${base64String}`;

	return json({ image: src });
}) satisfies RequestHandler;
