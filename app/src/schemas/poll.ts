import { z } from 'zod';

export const PollPathParams = z.object({
	id: z.string().describe('Poll ID')
});

export const CreatePollBody = z.object({
	question: z.string().min(1, 'Question is required').describe('The poll question'),
	options: z
		.array(z.string().min(1, 'Option cannot be empty').describe('Option label'))
		.min(2, 'At least 2 options required')
		.max(5, 'At most 5 options allowed')
		.describe('List of answer options')
});

export const CreatePollResponse = z.object({
	id: z.string().describe('Poll ID'),
	question: z.string().describe('The poll question'),
	createdAt: z.iso.datetime().describe('Creation timestamp'),
	options: z
		.array(
			z.object({
				id: z.number().describe('Option ID'),
				label: z.string().describe('Option label')
			})
		)
		.describe('Poll options')
});

export const PollOptionResponse = z.object({
	id: z.number().describe('Option ID'),
	label: z.string().describe('Option label'),
	votes: z.number().describe('Number of votes for this option')
});

export const GetPollResponse = z.object({
	id: z.string().describe('Poll ID'),
	question: z.string().describe('The poll question'),
	createdAt: z.string().datetime().describe('Creation timestamp'),
	totalVotes: z.number().describe('Total number of votes'),
	options: z.array(PollOptionResponse).describe('Poll options with vote counts')
});

export type CreatePollBodyType = z.infer<typeof CreatePollBody>;
export type CreatePollResponseType = z.infer<typeof CreatePollResponse>;
export type GetPollResponseType = z.infer<typeof GetPollResponse>;
export type PollOptionResponseType = z.infer<typeof PollOptionResponse>;
