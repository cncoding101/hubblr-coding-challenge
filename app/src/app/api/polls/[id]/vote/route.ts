import { NextResponse } from 'next/server';
import * as voteBusiness from '@/business/vote';
import { emit } from '@/event-emitter/poll';
import { CastVoteBody } from '@/schemas/vote';

/**
 * Cast a vote
 * @description Submit a vote for a specific option on a poll
 * @pathParams VotePathParams
 * @body CastVoteBody
 * @response 201:CastVoteResponse
 */
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	const body = await request.json();
	const parsed = CastVoteBody.safeParse(body);

	if (!parsed.success) {
		return NextResponse.json({ error: parsed.error.issues }, { status: 400 });
	}

	try {
		const vote = await voteBusiness.create(id, parsed.data.optionId, parsed.data.voterToken);
		emit(id);
		return NextResponse.json(vote, { status: 201 });
	} catch (error) {
		const message = error instanceof Error ? error.message : 'Failed to cast vote';

		if (message === 'Poll not found') {
			return NextResponse.json({ error: message }, { status: 404 });
		}
		if (
			message === 'Invalid option for this poll' ||
			message === 'You have already voted on this poll'
		) {
			return NextResponse.json({ error: message }, { status: 409 });
		}

		return NextResponse.json({ error: message }, { status: 500 });
	}
}
