<script lang="ts">
  export let text: string;
</script>

<div class="flex justify-between w-full px-2 text-surface-300/60">
  <span class="truncate">{text}</span>
  <span class="i-carbon-locked icon" />
</div>
