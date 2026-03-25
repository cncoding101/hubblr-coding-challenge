import { NextResponse } from 'next/server';
import * as pollBusiness from '@/business/poll';

/**
 * Get poll details
 * @description Fetches poll details including current vote counts
 * @pathParams PollPathParams
 * @response GetPollResponse
 */
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	const poll = await pollBusiness.fetch(id);

	if (!poll) {
		return NextResponse.json({ error: 'Poll not found' }, { status: 404 });
	}

	return NextResponse.json(poll);
}
