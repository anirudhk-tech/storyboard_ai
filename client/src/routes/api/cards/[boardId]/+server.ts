import { SERVER_URL } from '$lib/config.server';
import type { StoryCard } from '../../../../lib/types/storyCard';
import { json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = (async ({ params }) => {
	const res = await fetch(SERVER_URL + `/boards/${params.boardId}/cards/`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json'
		}
	});

	if (!res.ok) {
		throw new Error('Failed to fetch cards');
	}

	const data: StoryCard[] = await res.json();
	return json(data);
}) satisfies RequestHandler;

export const POST: RequestHandler = (async ({ request, params }) => {
	const { content, height, pos } = (await request.json()) as StoryCard;

	const res = await fetch(SERVER_URL + `/boards/${params.boardId}/cards/`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json'
		},
		body: JSON.stringify({ content, height, pos })
	});

	if (!res.ok) {
		throw new Error('Failed to create card');
	}

	const data: StoryCard = await res.json();
	return json(data);
}) satisfies RequestHandler;
