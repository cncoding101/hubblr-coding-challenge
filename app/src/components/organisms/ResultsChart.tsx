'use client';

import { Text } from '@/components/atoms/Text';
import { ProgressBar } from '@/components/molecules/ProgressBar';
import type { PollOptionResponse } from '@/generated/api/server.client';

interface ResultsChartProps {
	question: string;
	options: PollOptionResponse[];
	totalVotes: number;
	votedOptionId?: number;
}

export const ResultsChart = ({
	question,
	options,
	totalVotes,
	votedOptionId
}: ResultsChartProps) => {
	return (
		<div className="flex w-full flex-col gap-6">
			<Text variant="heading">{question}</Text>

			<div className="flex flex-col gap-4">
				{options.map((option) => {
					const percentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;

					return (
						<div key={option.id} className="flex flex-col gap-1.5">
							<div className="flex items-center justify-between">
								<Text
									variant="label"
									className={votedOptionId === option.id ? 'text-primary' : ''}
								>
									{option.label}
								</Text>
								<Text variant="label" color="muted">
									{option.votes} ({Math.round(percentage)}%)
								</Text>
							</div>
							<ProgressBar
								percentage={percentage}
								highlighted={votedOptionId === option.id}
							/>
						</div>
					);
				})}
			</div>

			<Text variant="paragraph" color="muted">
				{totalVotes} {totalVotes === 1 ? 'vote' : 'votes'} total
			</Text>
		</div>
	);
};
