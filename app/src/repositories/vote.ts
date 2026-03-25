import { prisma } from '@/db/prisma';

function create(pollId: string, optionId: number, voterToken: string) {
	return prisma.vote.create({
		data: { pollId, optionId, voterToken }
	});
}

function hasVoted(pollId: string, voterToken: string) {
	return prisma.vote.findUnique({
		// eslint-disable-next-line @typescript-eslint/naming-convention
		where: { pollId_voterToken: { pollId, voterToken } }
	});
}

export { create, hasVoted };
