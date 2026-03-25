'use client';

import { Text } from '@/components/atoms/Text';
import { CreatePollForm } from '@/components/organisms/CreatePollForm';

export default function Home() {
	return (
		<main className="bg-base-200 flex min-h-screen flex-col items-center justify-center px-4 py-12">
			<div className="bg-base-100 flex w-full max-w-lg flex-col items-center gap-8 rounded-xl p-8 shadow-md">
				<div className="flex flex-col items-center gap-2 text-center">
					<Text variant="heading">Create a Poll</Text>
					<Text variant="paragraph" color="muted">
						Ask a question, add options, and share it with anyone.
					</Text>
				</div>
				<CreatePollForm />
			</div>
		</main>
	);
}
