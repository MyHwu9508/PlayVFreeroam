<script lang="ts">
	export let label: string;
	export let subLabel: string | number = '';
</script>

<div class="-mt-0.5 flex items-baseline space-x-2">
	<div class="text-2xl">{label}:</div>
	<div class="truncate text-xl font-thin">{subLabel}</div>
</div>
