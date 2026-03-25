import { nanoid } from 'nanoid';
import { z } from 'zod';
import { createStorageInterface } from '@/storage';

export const appStorage = createStorageInterface({
	schema: {
		voterToken: z.string().min(1).default(nanoid()),
		votedPolls: z.record(z.string(), z.number()).default({})
	}
});
