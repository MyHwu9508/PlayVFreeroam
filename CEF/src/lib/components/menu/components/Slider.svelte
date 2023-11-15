<script lang="ts">
  import type { Slider } from '../../../../../../src/playv/client/ui/menu/framework/components/Slider';
  export let comp: Slider;
  let lastUpdate = Date.now();
  let transitionTime = 200;
  $: comp.value && updateTransitionTime();
  function updateTransitionTime() {
    transitionTime = Math.min(Date.now() - lastUpdate, 200);
    lastUpdate = Date.now();
  }
</script>

<div class="flex justify-between w-full px-2">
  <span class="truncate">{comp.text}</span>
  <div class="w-2/5 relative flex items-center">
    <div
      class="absolute w-1 h-full bg-secondary-500 transition-all"
      style="left: calc({((comp.value - comp.min) / (comp.max - comp.min)) * 100}% - {((comp.value - comp.min) /
        (comp.max - comp.min)) *
        0.25}rem);transition-duration: {transitionTime}ms;"
    />
    <div class="h-1 w-full bg-white" />
  </div>
</div>
