<script lang="ts">
  import { focusTrap, type ModalSettings, type ModalComponent, getModalStore } from '@skeletonlabs/skeleton';
  import { tick } from 'svelte';
  import type { CharEditorMetaData, CharEditorData } from '../../../src/playv/shared/types/charCreatorData';
  import MaskModal from './components/CharEditor/MaskModal.svelte';
  import CharacterMeta from './components/CharEditor/CharacterMeta.svelte';
  import HeadBlend from './components/CharEditor/HeadBlend.svelte';
  import FaceFeatures from './components/CharEditor/FaceFeatures.svelte';
  import Hair from './components/CharEditor/Hair.svelte';
  import Makeup from './components/CharEditor/Makeup.svelte';
  import Skin from './components/CharEditor/Skin.svelte';
  import Finish from './components/CharEditor/Finish.svelte';
  import Tattoos from './components/CharEditor/Tattoos.svelte';
  //Character Data and Sliderdata
  const PAGE_NAMES = ['Character', 'Head', 'Face', 'Hair', 'Skin', 'Makeup', 'Tattoos', 'Finish'];
  const modalStore = getModalStore();
  let overlayMaxIndece = [23, 28, 33, 14, 74, 6, 11, 10, 9, 17, 16, 11, 1];
  let data: CharEditorData = {
    headBlendData: {
      shapeFirst: 0,
      shapeSecond: 0,
      shapeThird: 0,
      skinFirst: 0,
      skinSecond: 0,
      skinThird: 0,
      shapeMix: 0,
      skinMix: 0,
      thirdMix: 0,
    },
    faceFeature: Array(20).fill(0),
    headOverlays: Array(12)
      .fill({})
      .map(() => ({
        index: 0,
        opacity: 0,
        colorID: 0,
        secondColorID: 0,
      })),
    eyeColor: 0,
    hairColor: {
      colorID: 0,
      highlightColorID: 0,
    },
    female: false,
    hairIndex: 0,
    overrideMakeupColor: false,
    overlays: [],
  };
  let nullData: CharEditorData = {
    headBlendData: {
      shapeFirst: 0,
      shapeSecond: 0,
      shapeThird: 0,
      skinFirst: 0,
      skinSecond: 0,
      skinThird: 0,
      shapeMix: 0,
      skinMix: 0,
      thirdMix: 0,
    },
    faceFeature: Array(20).fill(0),
    headOverlays: Array(12)
      .fill({})
      .map(() => ({
        index: 0,
        opacity: 0,
        colorID: 0,
        secondColorID: 0,
      })),
    eyeColor: 0,
    hairColor: {
      colorID: 0,
      highlightColorID: 0,
    },
    female: false,
    hairIndex: 0,
    overrideMakeupColor: false,
    overlays: [],
  };
  let metaData: CharEditorMetaData = {
    profileName: 'CHAR PROFILE NAME',
  };
  alt.on('charCreator:updateIndece', (maxIndece) => {
    overlayMaxIndece = maxIndece;
  });
  function syncData() {
    alt.emit('charCreator:syncData', data);
  }
  $: data && syncData();

  //PageData
  let isVisible = false;
  let trapFocus = true;
  let currentPage = 0;
  async function changePageBy(amount: number) {
    currentPage += amount;
    if (currentPage < 0) {
      currentPage = 0;
    } else if (currentPage > PAGE_NAMES.length - 1) {
      currentPage = PAGE_NAMES.length - 1;
    } else {
      trapFocus = false;
      await tick();
      trapFocus = true;
    }
  }

  alt.on('charCreator:open', (clientData: CharEditorData, clientMeta: CharEditorMetaData) => {
    data = clientData;
    metaData = clientMeta;
    currentPage = 0;
    isVisible = true;
  });

  alt.on('charCreator:close', () => {
    isVisible = false;
  });

  //Camera and Face Movement
  let cameraYVal = 0;
  let lastYval = 0;
  let collectedMov = {
    x: 0,
    y: 0,
  };

  function setTattooState(page: number) {
    alt.emit('charCreator:tattooState', page === 6);
  }
  $: setTattooState(currentPage);

  function faceMoveHandler(event: MouseEvent) {
    const target = event.target as HTMLDivElement;
    if (event.buttons !== 1 || document.activeElement !== document.body || target.nodeName !== 'DIV') {
      return;
    }
    const { movementX, movementY } = event;
    const x = movementX / target.getBoundingClientRect().width;
    const y = movementY / target.getBoundingClientRect().height;
    collectedMov.x += x;
    collectedMov.y += y;

    if (collectedMov.x > 0.03 || collectedMov.x < -0.03 || collectedMov.y > 0.03 || collectedMov.y < -0.03) {
      alt.emit('charCreator:faceMove', collectedMov.x, collectedMov.y);
      collectedMov.x = 0;
      collectedMov.y = 0;
    }
  }

  function cameraY() {
    if (cameraYVal === lastYval) {
      return;
    }
    alt.emit('charCreator:cameraY', cameraYVal);
    lastYval = cameraYVal;
    deactivatePreset();
  }
  $: cameraYVal && cameraY();
  alt.on('charCreator:setYval', (val: number) => {
    lastYval = val;
    cameraYVal = val;
  });

  let isCameraXActive = false;

  function incrementCameraX(event: PointerEvent, val: number) {
    if (isCameraXActive) return;
    isCameraXActive = true;
    alt.emit('charCreator:cameraXIncrement', val);
    deactivatePreset();
  }

  function clearCameraX() {
    isCameraXActive = false;
    alt.emit('charCreator:cameraXIncrement', 0);
  }

  function zoomCamera(event: WheelEvent) {
    alt.emit('charCreator:cameraZoom', event.deltaY / 100);
    deactivatePreset();
  }

  let isZoomActive = false;

  function incrementZoom(val: number) {
    if (isZoomActive) return;
    isZoomActive = true;
    alt.emit('charCreator:cameraZoomIncrement', val);
    deactivatePreset();
  }

  function clearZoom() {
    isZoomActive = false;
    alt.emit('charCreator:cameraZoomIncrement', 0);
  }

  //Camera presets
  const presetIcons = [
    'i-carbon-direction-straight-right rotate-180',
    'i-carbon-direction-u-turn',
    'i-carbon-user',
    'i-carbon-face-activated',
    'i-carbon-direction-straight-right',
  ];
  const pagePresets = [2, 3, 3, 2, 2, 3, -1, 2];
  let activePreset = 2;

  function deactivatePreset() {
    activePreset = -1;
  }

  function activatePreset(preset: number) {
    activePreset = preset;
    alt.emit('charCreator:cameraPreset', preset);
  }

  function pageChangePreset(page: number) {
    const pagePreset = pagePresets[page];
    if (activePreset === -1 || pagePreset === activePreset) return;
    activatePreset(pagePreset);
  }

  let yInterval: NodeJS.Timeout;

  function handleKeyDown(event: KeyboardEvent) {
    if (!isVisible) return;
    if (document.activeElement?.nodeName === 'INPUT') return;
    switch (event.key) {
      case 'q':
        incrementZoom(-0.5);
        break;
      case 'e':
        incrementZoom(0.5);
        break;
      case 'w':
        if (yInterval) return;
        yInterval = setInterval(() => {
          cameraYVal += 0.2;
          if (cameraYVal > 55) cameraYVal = 55;
        }, 10);
        break;
      case 's':
        if (yInterval) return;
        yInterval = setInterval(() => {
          cameraYVal -= 0.2;
          if (cameraYVal < -25) cameraYVal = -25;
        }, 10);
        break;
      case 'a':
        incrementCameraX(undefined as any, -2);
        break;
      case 'd':
        incrementCameraX(undefined as any, 2);
        break;
    }
  }
  function handleKeyUp(event: KeyboardEvent) {
    if (event.key === 'a' || event.key === 'd') {
      clearCameraX();
    } else if (event.key === 'q' || event.key === 'e') {
      clearZoom();
    } else if (event.key === 'w' || event.key === 's') {
      clearInterval(yInterval);
      yInterval = undefined as any;
    }
  }

  function resetDataForPage() {
    switch (currentPage) {
      case 1:
        data.headBlendData = nullData.headBlendData;
        break;
      case 2:
        data.faceFeature = nullData.faceFeature;
        break;
      case 3:
        data.hairIndex = nullData.hairIndex;
        data.hairColor = nullData.hairColor;
        data.headOverlays[1] = nullData.headOverlays[1];
        data.headOverlays[2] = nullData.headOverlays[2];
        data.headOverlays[10] = nullData.headOverlays[10];
        break;
      case 4:
        data.headOverlays[0] = nullData.headOverlays[0];
        data.headOverlays[3] = nullData.headOverlays[3];
        data.headOverlays[6] = nullData.headOverlays[6];
        data.headOverlays[7] = nullData.headOverlays[7];
        data.headOverlays[9] = nullData.headOverlays[9];
        data.headOverlays[11] = nullData.headOverlays[11];
        break;
      case 5:
        data.headOverlays[4] = nullData.headOverlays[4];
        data.headOverlays[5] = nullData.headOverlays[5];
        data.headOverlays[8] = nullData.headOverlays[8];
        data.overrideMakeupColor = nullData.overrideMakeupColor;
        break;
      case 6:
        data.overlays = nullData.overlays;
    }
  }

  $: pageChangePreset(currentPage);

  //Masks:
  const maskModalComponent: ModalComponent = {
    ref: MaskModal,
    props: {},
    slot: '',
  };
  const maskModal: ModalSettings = {
    type: 'component',
    component: maskModalComponent,
    position: 'items-start pt-[6vh]',
  };
</script>

<svelte:document
  on:keydown={handleKeyDown}
  on:keyup={handleKeyUp}
  on:pointerup={() => {
    clearCameraX();
    clearZoom();
  }}
/>

{#if isVisible}
  <div class="fixed flex h-full w-full select-none items-center" use:focusTrap={trapFocus}>
    <div class="card !bg-surface-700/90 ml-6 flex h-[86vh] w-[30vw] flex-col justify-between p-4">
      <div class="flex items-start justify-between">
        <div>
          <h2 class="font-bold">{PAGE_NAMES[currentPage]}</h2>
          <p class="text-surface-300 text-sm">
            Editing: {metaData.profileName}
          </p>
        </div>
        {#if currentPage > 0 && currentPage < 7}
          <button class="btn variant-ghost-primary btn-sm text-xs" on:click={resetDataForPage}>Reset page to 0</button>
        {/if}
      </div>
      <div class="my-2 grid space-y-1 overflow-y-auto overflow-x-hidden px-0.5 py-1">
        {#if currentPage === 0}
          <CharacterMeta bind:data bind:metaData />
        {:else if currentPage === 1}
          <HeadBlend bind:data />
        {:else if currentPage === 2}
          <FaceFeatures bind:data />
        {:else if currentPage === 3}
          <Hair bind:data />
        {:else if currentPage === 4}
          <Skin bind:data {overlayMaxIndece} />
        {:else if currentPage === 5}
          <Makeup bind:data {overlayMaxIndece} />
        {:else if currentPage === 6}
          <Tattoos bind:data />
        {:else if currentPage === 7}
          <Finish metadata={metaData} />
        {/if}
      </div>
      <div class="flex items-center justify-between">
        <button class="btn-icon btn-icon-lg variant-ghost-primary" on:click={() => changePageBy(-1)}
          ><span class="i-carbon-arrow-left text-3xl" /></button
        >
        <p class="self-end text-sm font-light">{currentPage + 1} / {PAGE_NAMES.length}</p>
        <button class="btn-icon btn-icon-lg variant-ghost-primary" on:click={() => changePageBy(1)}
          ><span class="i-carbon-arrow-right text-3xl" /></button
        >
      </div>
    </div>
  </div>

  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div class="fixed right-[2vw] top-[5vh] h-[90vh] w-[65vw]" on:mousemove={faceMoveHandler} on:wheel={zoomCamera}>
    <div class="flex justify-center">
      <div class="absolute bottom-0 flex w-[50vw] select-none items-center justify-between">
        <div>
          <button
            class="btn-icon variant-ghost-primary w-16 active:scale-90"
            on:pointerdown={(e) => incrementCameraX(e, -2)}
            ><span class="i-carbon-direction-bear-right-01 -rotate-90 text-5xl" /></button
          >
          <button class="btn-icon variant-ghost-primary w-10 active:scale-90" on:pointerdown={() => incrementZoom(0.5)}
            ><span class="i-carbon-zoom-out text-xl" /></button
          >
        </div>
        <div class="mt-8 flex space-x-1">
          {#if currentPage !== 6}
            {#each presetIcons as icon, i}
              <button
                class="btn-icon variant-filled-{activePreset === i ? 'primary' : 'surface'} w-10"
                on:click={() => activatePreset(i)}><span class={icon} /></button
              >
            {/each}
          {/if}
        </div>

        <div>
          <button class="btn-icon variant-ghost-primary w-10 active:scale-90" on:pointerdown={() => incrementZoom(-0.5)}
            ><span class="i-carbon-zoom-in text-xl" /></button
          >
          <button
            class="btn-icon variant-ghost-primary w-16 active:scale-90"
            on:pointerdown={(e) => incrementCameraX(e, 2)}
            ><span class="i-carbon-direction-bear-right-01 -rotate-90 -scale-y-100 text-5xl" /></button
          >
        </div>
      </div>
    </div>
    <div class="absolute right-6 top-0 -mt-6">
      <button class="btn btn-sm variant-ghost-primary select-none" on:click={() => modalStore.trigger(maskModal)}>
        Change mask
      </button>
    </div>
    <div class="absolute right-0 h-[100%] w-4">
      <input
        class="vertical !accent-primary-500 h-full"
        type="range"
        min="-25"
        step="0.1"
        max="55"
        bind:value={cameraYVal}
      />
    </div>
  </div>
{/if}

<style>
  .vertical {
    -webkit-appearance: slider-vertical;
    appearance: slider-vertical;
  }
</style>
