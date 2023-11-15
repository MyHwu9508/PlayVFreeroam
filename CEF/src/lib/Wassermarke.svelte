<script lang="ts">
  import { fade } from 'svelte/transition';
  let visible = true;
  let currentPosition = 0;
  alt.on('setWatermark', (state) => {
    visible = state;
  });
  alt.on('watermark:setPos', (pos) => {
    currentPosition = pos;
  });
  const POSITIONS = [
    'bottom-[6px] right-[30px]',
    'top-[6px] right-[30px]',
    'top-[6px] left-[31px]',
    'top-[6px] left-[50%] -translate-x-1/2',
    'bottom-[6px] left-[50%] -translate-x-1/2',
  ];
</script>

{#if visible}
  <span class="text-primary-500 absolute z-[9999] {POSITIONS[currentPosition]}" transition:fade={{ duration: 250 }}>
    PlayV.mp
  </span>
{/if}

<style>
  span {
    font-family: 'Segoe UI' !important;
    font-size: 14.4px !important;
    font-weight: 500;
    text-shadow: 0 0.5px 1px rgb(0 0 0 / 50%);
    margin: 0px;
    line-height: 22px;
  }
</style>
