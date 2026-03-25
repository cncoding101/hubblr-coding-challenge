import { getPollById } from '@/repositories/poll';

export default async (pollId: string) => {
	return getPollById(pollId);
};
