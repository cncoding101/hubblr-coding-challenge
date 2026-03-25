import { create } from '@/repositories/poll';

export default async (question: string, options: string[]) => {
	if (options.length < 2 || options.length > 5) {
		throw new Error('A poll must have between 2 and 5 options');
	}

	if (!question.trim()) {
		throw new Error('Question cannot be empty');
	}

	return create(
		question.trim(),
		options.map((o) => o.trim())
	);
};
