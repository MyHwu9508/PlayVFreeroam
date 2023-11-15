<script lang="ts">
	import { colord } from 'colord';
	export let pos: { x: number; y: number };
	export let hex: string;
	export let size = '1rem';
	export let borderWidth = 4;
	export let container: HTMLDivElement | undefined;
	export let switchBorderColor = false;
	let pointerElement: HTMLDivElement | undefined;

	$: screenPos = calcScreenPosition(pos.x, pos.y, container);
	$: isColorLight = colord(hex).toHsv().s < 25 && colord(hex).toHsv().v > 75;

	function calcScreenPosition(left: number, top: number, container: HTMLDivElement | undefined) {
		if (!container || !pointerElement) return { x: 0, y: 0 };
		const pointerRect = pointerElement.getBoundingClientRect();
		const x = ((container.clientWidth - pointerRect.width) * left) / 100;
		const y = ((container.clientHeight - pointerRect.height) * top) / 100;
		return { x, y };
	}
</script>

<div
	bind:this={pointerElement}
	class="pointer-events-none relative z-20 origin-center rounded-full {isColorLight &&
	switchBorderColor
		? 'border-black'
		: 'border-white'}"
	style={`left: ${screenPos.x}px; top: ${screenPos.y}px;background-color: ${hex};border-width: ${borderWidth}px;height: ${size};width: ${size};`} />
