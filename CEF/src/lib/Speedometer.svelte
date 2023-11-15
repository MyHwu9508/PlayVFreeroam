<script lang="ts">
  import { fly } from 'svelte/transition';
  import { isHudActive } from './store/hud';
  import Forza4Digital from './components/speedometers/Forza4Digital.svelte';
  import OnlyNumber from './components/speedometers/OnlyNumber.svelte';
  import Binary from './components/speedometers/Binary.svelte';
  import Forza5Digital from './components/speedometers/Forza5Digital.svelte';
  import NFS from './components/speedometers/NFS.svelte';
  import { tweened } from 'svelte/motion';

  type Data = {
    speed: number;
    rpm: number;
    gear: number;
    lightState: number;
  };

  let visible = false;
  let refreshInterval = 150;

  let config = {
    mode: 0, //0 kmh, 1mph
    width: 20,
    fps: 200,
    bottom: 2.5,
    right: 0.2,
    speedoMeterType: 0,
  };

  const rpmTweenedStore = tweened(0, { duration: refreshInterval });
  const speedTweenedStore = tweened(0, { duration: refreshInterval });
  let gear = 0;
  let lightState = 0;

  alt.on('updateSpeedometer', updateSpeedometer);
  alt.on('updateSpeedometerConfig', updateSpeedometerConfig);
  alt.on('toggleSpeedometer', toggleSpeedometer);

  function toggleSpeedometer(state: boolean) {
    visible = state;
  }

  function updateSpeedometerConfig(newConfig: typeof config) {
    config = newConfig;
  }

  function updateSpeedometer(serverData: Data) {
    gear = calcGearText(serverData.gear) as number;
    lightState = serverData.lightState;

    let newSpeed = Math.round(config.mode ? serverData.speed * 2.236936 : serverData.speed * 3.6);
    if (serverData.rpm > 0.23 || newSpeed > 10 || $rpmTweenedStore > 0.23) {
      rpmTweenedStore.set(serverData.rpm);
    }
    speedTweenedStore.set(newSpeed);
  }

  function calcGearText(currentGear: number) {
    switch (currentGear) {
      case 0:
        if ($speedTweenedStore > 1 && $rpmTweenedStore > 0.21) {
          return 'R';
        } else {
          return 'N';
        }
      default:
        return currentGear;
    }
  }

  setInterval(() => {
    if ($speedTweenedStore < 10 && $rpmTweenedStore <= 0.23) {
      const rpmNum = getRandom(18, 22);
      const newRpm = rpmNum / 100;
      rpmTweenedStore.set(newRpm);
    }
  }, 75);

  function getRandom(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
</script>

{#if $isHudActive && visible}
  <div
    class="pointer-events-none fixed"
    style="width: {config.width}%;bottom:{config.bottom}%;right:{config.right}%;"
    transition:fly={{ x: 150, duration: 300 }}
  >
    {#if config.speedoMeterType == 1}
      <Forza4Digital mode={config.mode} speed={$speedTweenedStore} rpm={$rpmTweenedStore} {gear} />
    {:else if config.speedoMeterType == 0}
      <Forza5Digital mode={config.mode} speed={$speedTweenedStore} rpm={$rpmTweenedStore} {gear} />
    {:else if config.speedoMeterType == 2}
      <NFS mode={config.mode} speed={$speedTweenedStore} rpm={$rpmTweenedStore} {gear} {lightState} />
    {:else if config.speedoMeterType == 3}
      <OnlyNumber speed={$speedTweenedStore} />
    {:else if config.speedoMeterType == 4}
      <Binary speed={$speedTweenedStore} />
    {/if}
  </div>
{/if}
