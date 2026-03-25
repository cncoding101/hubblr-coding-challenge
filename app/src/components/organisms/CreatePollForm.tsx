'use client';

import { useForm } from '@tanstack/react-form';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/atoms/Button';
import { Icon } from '@/components/atoms/Icon';
import { Text } from '@/components/atoms/Text';
import { OptionField } from '@/components/molecules/OptionField';
import { Input } from '@/components/shadcn-ui/Input';
import { postPolls } from '@/generated/api/server.client';
import type { CreatePollBodyType } from '@/schemas/poll';
import { LoadingSpinner } from '../atoms/LoadingSpinner';

const MIN_OPTIONS = 2;
const MAX_OPTIONS = 5;

export const CreatePollForm = () => {
	const router = useRouter();

	const mutation = useMutation({
		mutationFn: (data: CreatePollBodyType) => postPolls(data)
	});

	const form = useForm({
		defaultValues: {
			question: '',
			options: ['', '']
		},
		onSubmit: async ({ value }) => {
			const result = await mutation.mutateAsync({
				question: value.question,
				options: value.options
			});
			router.push(`/poll/${result.data.id}`);
		}
	});

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				form.handleSubmit();
			}}
			className="flex w-full max-w-lg flex-col gap-6"
		>
			<div className="flex flex-col gap-2">
				<Text variant="label">Question</Text>
				<form.Field
					name="question"
					validators={{
						onSubmit: ({ value }) => (value.trim() ? undefined : 'Question is required')
					}}
				>
					{(field) => (
						<div className="flex flex-col gap-1">
							<Input
								placeholder="What do you want to ask?"
								value={field.state.value}
								onChange={(e) => field.handleChange(e.target.value)}
								onBlur={field.handleBlur}
								aria-invalid={field.state.meta.errors.length > 0}
								className={field.state.meta.errors.length > 0 ? 'border-error' : ''}
							/>
							{field.state.meta.errors.length > 0 && (
								<p className="text-error text-xs">{field.state.meta.errors[0]}</p>
							)}
						</div>
					)}
				</form.Field>
			</div>

			<div className="flex flex-col gap-3">
				<Text variant="label">Options</Text>
				<form.Field name="options" mode="array">
					{(field) => (
						<>
							<div className="flex max-h-48 flex-col gap-3 overflow-y-auto">
								{field.state.value.map((_, i) => (
									<form.Field
										key={i}
										name={`options[${i}]`}
										validators={{
											onSubmit: ({ value }) => (value.trim() ? undefined : 'Option cannot be empty')
										}}
									>
										{(subField) => (
											<OptionField
												index={i}
												value={subField.state.value}
												onChange={(val) => subField.handleChange(val)}
												onRemove={() => field.removeValue(i)}
												canRemove={field.state.value.length > MIN_OPTIONS}
												error={
													subField.state.meta.errors.length > 0
														? String(subField.state.meta.errors[0])
														: undefined
												}
											/>
										)}
									</form.Field>
								))}
							</div>

							{field.state.value.length < MAX_OPTIONS && (
								<Button
									type="button"
									variant="outline"
									size="sm"
									onClick={() => field.pushValue('')}
								>
									<Icon variant={{ type: 'round', icon: 'add' }} size="1.25rem" />
									Add option
								</Button>
							)}
						</>
					)}
				</form.Field>
			</div>

			<form.Subscribe selector={(state) => [state.isSubmitting, state.canSubmit]}>
				{([isSubmitting, canSubmit]) => (
					<Button type="submit" disabled={isSubmitting || !canSubmit}>
						Create Poll {isSubmitting ? <LoadingSpinner /> : ''}
					</Button>
				)}
			</form.Subscribe>
		</form>
	);
};
