import { z } from 'zod';

export const VotePathParams = z.object({
	id: z.string().describe('Poll ID')
});

export const CastVoteBody = z.object({
	optionId: z.number().int().positive().describe('ID of the option to vote for'),
	voterToken: z.string().min(1, 'Voter token is required').describe('Unique browser token')
});

export const CastVoteResponse = z.object({
	id: z.number().describe('Vote ID'),
	pollId: z.string().describe('Poll ID'),
	optionId: z.number().describe('Voted option ID'),
	voterToken: z.string().describe('Voter token'),
	createdAt: z.string().datetime().describe('Vote timestamp')
});

export type CastVoteBodyType = z.infer<typeof CastVoteBody>;
export type CastVoteResponseType = z.infer<typeof CastVoteResponse>;
