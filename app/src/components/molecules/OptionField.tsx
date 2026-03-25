'use client';

import { Input } from '@/components/shadcn-ui/Input';
import { Button } from '@/components/atoms/Button';
import { Icon } from '@/components/atoms/Icon';

interface OptionFieldProps {
	index: number;
	value: string;
	onChange: (value: string) => void;
	onRemove: () => void;
	canRemove: boolean;
	error?: string;
}

export const OptionField = ({
	index,
	value,
	onChange,
	onRemove,
	canRemove,
	error
}: OptionFieldProps) => {
	return (
		<div className="flex flex-col gap-1">
			<div className="flex items-center gap-2">
				<Input
					placeholder={`Option ${index + 1}`}
					value={value}
					onChange={(e) => onChange(e.target.value)}
					aria-invalid={!!error}
					className={error ? 'border-error' : ''}
				/>
				{canRemove && (
					<Button variant="ghost" size="icon-sm" onClick={onRemove} aria-label="Remove option">
						<Icon variant={{ type: 'round', icon: 'close' }} size="1.25rem" />
					</Button>
				)}
			</div>
			{error && <p className="text-error text-xs">{error}</p>}
		</div>
	);
};
