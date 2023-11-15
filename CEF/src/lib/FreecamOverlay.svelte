<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import { isHudActive } from './store/hud';
  let visible = false;
  let speed = 50;
  let fov = 68;
  let lerpFactor = 1.5;
  let rotMode: 'euler' | 'quat' = 'euler';
  let camRotVelocityActive = false;
  let rotationSpeed = 1;
  let canvas: HTMLCanvasElement;
  let camOverlay: number;
  let moveMode = 'direct';

  onMount(() => {
    alt.on('freecam:updateState', updateState);
    alt.on('freecam:setVisible', setVisible);
  });

  onDestroy(() => {
    alt.off('freecam:updateState', updateState);
    alt.off('freecam:setVisible', setVisible);
  });

  function setVisible(state: boolean) {
    visible = state;
    camOverlay = 0;
  }

  function updateState(
    newSpeed: number,
    newFov: number,
    newLerpFactor: number,
    newRotMode: 'euler' | 'quat',
    newCamRotVelocityActive: boolean,
    newRotationSpeed: number,
    newCamOverlay: number,
    newMoveMode: string
  ) {
    speed = newSpeed;
    fov = newFov;
    lerpFactor = newLerpFactor;
    rotMode = newRotMode;
    camRotVelocityActive = newCamRotVelocityActive;
    rotationSpeed = newRotationSpeed;
    camOverlay = newCamOverlay;
    moveMode = newMoveMode;
  }

  $: drawCamOverlay(camOverlay);

  function drawCamOverlay(id: number) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    switch (id) {
      case 0: // None
        break;
      case 1: // Rule of Thirds Lines
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.fillRect(canvas.width / 3, 0, 1, canvas.height);
        ctx.fillRect((canvas.width / 3) * 2, 0, 1, canvas.height);
        ctx.fillRect(0, canvas.height / 3, canvas.width, 1);
        ctx.fillRect(0, (canvas.height / 3) * 2, canvas.width, 1);
        break;
      case 2: //Phi grid
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.fillRect(canvas.width / 1.618, 0, 1, canvas.height);
        ctx.fillRect(canvas.width - canvas.width / 1.618, 0, 1, canvas.height);
        ctx.fillRect(0, canvas.height / 1.618, canvas.width, 1);
        ctx.fillRect(0, canvas.height - canvas.height / 1.618, canvas.width, 1);
        break;
    }
  }
</script>

{#if visible && $isHudActive}
  <canvas class="fixed" bind:this={canvas} width={window.innerWidth} height={window.innerHeight} />
  <div class="fixed flex h-full w-full justify-center">
    <div
      class="bg-surface-700/80 rounded-bl-container-token rounded-br-container-token flex h-min items-center justify-between gap-8 px-4 py-1"
    >
      <div>Speed <span class="font-mono">{speed.toFixed(1)}</span></div>
      <div class="flex items-center gap-2">
        Movement Smoothing
        {#if moveMode !== 'direct'}
          <div class="bg-success-500 h-[1vh] w-[1vh] rounded-full" />
        {:else}
          <div class="bg-surface-900 h-[1vh] w-[1vh] rounded-full" />
        {/if}
      </div>
      <div>Zoom <span class="font-mono">{fov.toFixed(1)}</span></div>
      <div>Acceleration <span class="font-mono">{lerpFactor.toFixed(2)}</span></div>
      <div>Rotation Speed <span class="font-mono">{rotationSpeed.toFixed(2)}</span></div>
      <div class="flex items-center gap-2">
        360°
        {#if rotMode === 'euler'}
          <div class="bg-surface-900 h-[1vh] w-[1vh] rounded-full" />
        {:else}
          <div class="bg-success-500 h-[1vh] w-[1vh] rounded-full" />
        {/if}
      </div>
      <div class="flex items-center gap-2">
        Rotation Acceleration Mode
        {#if camRotVelocityActive}
          <div class="bg-success-500 h-[1vh] w-[1vh] rounded-full" />
        {:else}
          <div class="bg-surface-900 h-[1vh] w-[1vh] rounded-full" />
        {/if}
      </div>
    </div>
  </div>
{/if}
