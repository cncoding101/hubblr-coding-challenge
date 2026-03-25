import { subscribe } from '@/event-emitter/poll';

/**
 * @ignore
 */
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;

	const stream = new ReadableStream({
		start(controller) {
			const encoder = new TextEncoder();

			const unsubscribe = subscribe(id, (data) => {
				controller.enqueue(encoder.encode(`data: ${data}\n\n`));
			});

			_request.signal.addEventListener('abort', () => {
				unsubscribe();
				controller.close();
			});
		}
	});

	return new Response(stream, {
		headers: {
			'Content-Type': 'text/event-stream',
			'Cache-Control': 'no-cache',
			Connection: 'keep-alive'
		}
	});
}
