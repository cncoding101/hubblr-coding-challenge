import { z } from 'zod';
import { nanoid } from 'nanoid';
import { createStorageInterface } from '@/storage';

export const appStorage = createStorageInterface({
	schema: {
		voterToken: z.string().min(1).default(nanoid()),
		votedPolls: z.record(z.string(), z.number()).default({})
	}
});
