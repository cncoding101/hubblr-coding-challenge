import { getPollById } from '@/repositories/poll';
import { hasVoted, create } from '@/repositories/vote';

export default async (pollId: string, optionId: number, voterToken: string) => {
	const poll = await getPollById(pollId);

	if (!poll) {
		throw new Error('Poll not found');
	}

	const validOption = poll.options.some((o) => o.id === optionId);
	if (!validOption) {
		throw new Error('Invalid option for this poll');
	}

	const existing = await hasVoted(pollId, voterToken);
	if (existing) {
		throw new Error('You have already voted on this poll');
	}

	return create(pollId, optionId, voterToken);
};
