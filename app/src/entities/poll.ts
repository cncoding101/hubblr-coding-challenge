import type { Prisma } from '@/generated/prisma/client';

type RawPoll = Prisma.PollGetPayload<{
	include: {
		options: {
			include: {
				_count: { select: { votes: true } };
			};
		};
		_count: { select: { votes: true } };
	};
}>;

export interface PollOption {
	id: number;
	label: string;
	votes: number;
}

export interface Poll {
	id: string;
	question: string;
	createdAt: Date;
	totalVotes: number;
	options: PollOption[];
}

export const toPoll = (raw: RawPoll): Poll => ({
	id: raw.id,
	question: raw.question,
	createdAt: raw.createdAt,
	totalVotes: raw._count.votes,
	options: raw.options.map((option) => ({
		id: option.id,
		label: option.label,
		votes: option._count.votes
	}))
});
