import { SERVER_URL } from '$lib/config.server';
import { json, type RequestHandler } from '@sveltejs/kit';
import type { StoryCard } from '../../../../lib/types/storyCard';

export const GET: RequestHandler = (async ({ params }) => {
	const res = await fetch(SERVER_URL + '/cards/' + params.id, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json'
		}
	});

	if (!res.ok) {
		throw new Error('Failed to fetch cards');
	}

	const data: StoryCard = await res.json();
	return json(data);
}) satisfies RequestHandler;

export const PUT: RequestHandler = (async ({ request, params }) => {
	const { content, height, pos } = (await request.json()) as StoryCard;

	const res = await fetch(SERVER_URL + '/cards/' + params.id, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json'
		},
		body: JSON.stringify({ content, height, pos })
	});

	if (!res.ok) {
		throw new Error('Failed to update card');
	}

	const data: StoryCard = await res.json();
	return json(data);
}) satisfies RequestHandler;

export const DELETE: RequestHandler = (async ({ params }) => {
	const res = await fetch(SERVER_URL + '/cards/' + params.id, {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json'
		}
	});

	if (!res.ok) {
		throw new Error('Failed to delete card');
	}

	return json({ message: 'Card deleted successfully' });
}) satisfies RequestHandler;
