'use client';

interface ProgressBarProps {
	percentage: number;
	highlighted?: boolean;
}

export const ProgressBar = ({ percentage, highlighted }: ProgressBarProps) => {
	return (
		<div className="bg-base-200 h-3 w-full overflow-hidden rounded-full">
			<div
				className={`h-full rounded-full transition-all duration-500 ease-out ${
					highlighted ? 'bg-primary' : 'bg-base-300'
				}`}
				style={{ width: `${percentage}%` }}
			/>
		</div>
	);
};
