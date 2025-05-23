import { generateMessage } from '$lib/services/aiServices';
import { json, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = (async ({ request }) => {
	const { conversation } = await request.json();

	const message = await generateMessage(conversation);

	return json({ message });
}) satisfies RequestHandler;
