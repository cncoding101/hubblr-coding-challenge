import { prisma } from '@/db/prisma';
import { toPoll } from '@/entities/poll';

function create(question: string, options: string[]) {
	return prisma.poll.create({
		data: {
			question,
			options: {
				create: options.map((label, index) => ({
					label,
					position: index
				}))
			}
		},
		include: { options: { orderBy: { position: 'asc' } } }
	});
}

export async function getPollById(pollId: string) {
	const raw = await prisma.poll.findUnique({
		where: { id: pollId },
		include: {
			options: {
				orderBy: { position: 'asc' },
				include: {
					_count: { select: { votes: true } }
				}
			},
			_count: { select: { votes: true } }
		}
	});

	if (!raw) return null;

	return toPoll(raw);
}

export { create };
