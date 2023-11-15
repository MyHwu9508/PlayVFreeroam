<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import type { NotificationType } from '../../../src/playv/shared/types/types';
  import { fly, slide } from 'svelte/transition';
  import { flip } from 'svelte/animate';
  import { isHudActive } from './store/hud';
  import { toasts } from './store/toast';
  import type { Toast } from '../types/toast';

  let toastArray: Toast[] = [];
  let toastUnsub: Function;
  onMount(() => {
    toastUnsub = toasts.subscribe((toasts) => {
      toastArray = [...toasts].map((t) => t[1]);
    });
  });

  onDestroy(() => {
    if (toastUnsub) {
      toastUnsub();
    }
  });

  const variantStyles: Record<NotificationType, string> = {
    information: 'from-secondary-700/30 border-secondary-500/90',
    success: 'from-success-700/30 border-success-500/90',
    warning: 'from-warning-700/30 border-warning-500/90',
    error: 'from-error-600/40 border-error-500/90',
  };

  const variantIcons: Record<NotificationType, string> = {
    information: 'i-carbon-information-filled',
    success: 'i-carbon-checkmark-filled',
    warning: 'i-carbon-warning-filled',
    error: 'i-carbon-error-filled',
  };

  const variantIconContainer: Record<NotificationType, string> = {
    information: 'bg-secondary-700',
    success: 'bg-success-700',
    warning: 'bg-warning-700',
    error: 'bg-error-700',
  };
</script>

{#if $isHudActive}
  <div class="pointer-events-none fixed flex h-full w-full flex-col items-end justify-start gap-1.5 p-1.5">
    {#each toastArray as toast (toast)}
      <div
        class="rounded-container-token to-surface-700/60 border-token relative flex w-80 items-center justify-between bg-gradient-to-b from-30% p-1 {variantStyles[
          toast.variant
        ]}"
        animate:flip={{ duration: 150 }}
        in:fly={{ y: 100, duration: 250 }}
        out:fly={{ x: 200, duration: 150 }}
      >
        <div>
          {#if toast.title}
            <p class="-my-1 -ml-1 pl-1 text-lg font-semibold">{toast.title}</p>
          {/if}
          <p class="pl-1 font-medium">{toast.text}</p>
        </div>
        <div class="{variantIconContainer[toast.variant]} flex items-center justify-center rounded-xl p-1.5">
          <span class="{variantIcons[toast.variant]} text-2xl text-white" />
        </div>
      </div>
    {/each}
  </div>
{/if}
