<script lang="ts">
  import '../app.postcss';
  import '../fonts.postcss';

  // Highlight JS
  import hljs from 'highlight.js';
  import 'highlight.js/styles/github-dark.css';
  import { initializeStores, storeHighlightJs } from '@skeletonlabs/skeleton';
  storeHighlightJs.set(hljs);

  // Floating UI for Popups
  import { computePosition, autoUpdate, flip, shift, offset, arrow } from '@floating-ui/dom';
  import { storePopup } from '@skeletonlabs/skeleton';
  import { browser } from '$app/environment';
  import { uiScale } from '$lib/store/menu';
  storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });
  initializeStores();

  //Scaling compared to an fullscreen window at 1080p
  let innerWidth = 0;
  $: if (browser) document.documentElement.style.fontSize = String(16 * (innerHeight / (1100 * $uiScale))) + 'px';
</script>

<slot />
