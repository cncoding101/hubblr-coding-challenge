'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { use, useState } from 'react';
import { LoadingSpinner } from '@/components/atoms/LoadingSpinner';
import { Text } from '@/components/atoms/Text';
import { ShareLink } from '@/components/molecules/ShareLink';
import { ResultsChart } from '@/components/organisms/ResultsChart';
import { VotingCard } from '@/components/organisms/VotingCard';
import { getPollsId, postPollsIdVote } from '@/generated/api/server.client';
import { usePollEvents } from '@/hooks/useEvents';
import type { CastVoteBodyType } from '@/schemas/vote';
import { appStorage } from '@/storage/app-storage';

export default function PollPage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = use(params);
	const queryClient = useQueryClient();

	const pollQuery = useQuery({
		queryKey: ['poll', id],
		queryFn: () => getPollsId(id)
	});

	usePollEvents(id, {
		onVote: () => queryClient.invalidateQueries({ queryKey: ['poll', id] })
	});

	const votedPolls = appStorage.get('votedPolls');
	const [votedOptionId, setVotedOptionId] = useState<number | undefined>(votedPolls[id]);

	const voteMutation = useMutation({
		mutationFn: (data: CastVoteBodyType) => postPollsIdVote(id, data),
		onSuccess: (_data, { optionId }) => {
			appStorage.set('votedPolls', { ...votedPolls, [id]: optionId });
			setVotedOptionId(optionId);
			queryClient.invalidateQueries({ queryKey: ['poll', id] });
		},
		onError: (error) => {
			throw error;
		}
	});

	if (pollQuery.isLoading) {
		return (
			<main className="bg-base-200 flex min-h-screen items-center justify-center">
				<LoadingSpinner />
			</main>
		);
	}

	if (pollQuery.isError || !pollQuery.data) {
		return (
			<main className="bg-base-200 flex min-h-screen items-center justify-center">
				<Text variant="paragraph" color="muted">
					Poll not found
				</Text>
			</main>
		);
	}

	const poll = pollQuery.data.data;
	const shareUrl = typeof window === 'undefined' ? '' : window.location.href;

	return (
		<main className="bg-base-200 flex min-h-screen flex-col items-center justify-center px-4 py-12">
			<div className="bg-base-100 flex w-full max-w-lg flex-col gap-6 rounded-xl p-8 shadow-md">
				{votedOptionId ? (
					<ResultsChart
						question={poll.question}
						options={poll.options}
						totalVotes={poll.totalVotes}
						votedOptionId={votedOptionId}
					/>
				) : (
					<VotingCard
						question={poll.question}
						options={poll.options}
						onVote={(optionId) =>
							voteMutation.mutate({
								optionId,
								voterToken: appStorage.get('voterToken')
							})
						}
						isSubmitting={voteMutation.isPending}
					/>
				)}

				<ShareLink url={shareUrl} />
			</div>
		</main>
	);
}
