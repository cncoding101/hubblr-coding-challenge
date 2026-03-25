'use client';

import { useState } from 'react';
import { Button } from '@/components/atoms/Button';

interface ShareLinkProps {
	url: string;
}

export const ShareLink = ({ url }: ShareLinkProps) => {
	const [copied, setCopied] = useState(false);

	const handleCopy = async () => {
		await navigator.clipboard.writeText(url);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	return (
		<div className="flex items-center justify-between">
			<span className="text-base-content-muted py-2 text-sm">{url}</span>
			<Button variant="outline" size="sm" onClick={handleCopy}>
				{copied ? 'Copied!' : 'Copy'}
			</Button>
		</div>
	);
};
