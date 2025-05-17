import interact from 'interactjs';
export function draggable(node: HTMLElement, opts: Interact.Options) {
	const ctx = interact(node).draggable(opts);
	return {
		update(newOpts: Interact.Options) {
			ctx.draggable(newOpts);
		},
		destroy() {
			ctx.unset();
		}
	};
}
