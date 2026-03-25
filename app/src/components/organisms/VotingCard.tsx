'use client';

import { useState } from 'react';
import { Button } from '@/components/atoms/Button';
import { LoadingSpinner } from '@/components/atoms/LoadingSpinner';
import { Text } from '@/components/atoms/Text';
import type { PollOptionResponse } from '@/generated/api/server.client';

interface VotingCardProps {
	question: string;
	options: PollOptionResponse[];
	onVote: (optionId: number) => void;
	isSubmitting: boolean;
}

export const VotingCard = ({ question, options, onVote, isSubmitting }: VotingCardProps) => {
	const [selectedId, setSelectedId] = useState<number | null>(null);

	return (
		<div className="flex w-full flex-col gap-6">
			<Text variant="heading">{question}</Text>

			<div className="flex flex-col gap-3">
				{options.map((option) => (
					<label
						key={option.id}
						className={`border-base-300 flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition-colors ${
							selectedId === option.id ? 'border-primary bg-secondary' : 'hover:bg-base-200'
						}`}
					>
						<input
							type="radio"
							name="poll-option"
							value={option.id}
							checked={selectedId === option.id}
							onChange={() => setSelectedId(option.id)}
							className="accent-primary"
						/>
						<Text variant="paragraph">{option.label}</Text>
					</label>
				))}
			</div>

			<Button
				onClick={() => selectedId !== null && onVote(selectedId)}
				disabled={selectedId === null || isSubmitting}
			>
				Vote {isSubmitting ? <LoadingSpinner /> : ''}
			</Button>
		</div>
	);
};
