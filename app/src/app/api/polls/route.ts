import { NextResponse } from 'next/server';
import * as pollBusiness from '@/business/poll';
import { CreatePollBody } from '@/schemas/poll';

/**
 * Create a new poll
 * @description Creates a poll with a question and 2–5 answer options
 * @body CreatePollBody
 * @response 201:CreatePollResponse
 */
export async function POST(request: Request) {
	const body = await request.json();
	const parsed = CreatePollBody.safeParse(body);

	if (!parsed.success) {
		return NextResponse.json({ error: parsed.error.issues }, { status: 400 });
	}

	const poll = await pollBusiness.create(parsed.data.question, parsed.data.options);

	return NextResponse.json(poll, { status: 201 });
}
