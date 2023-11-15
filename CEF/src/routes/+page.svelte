<script>
  import CharEditor from '$lib/CharEditor.svelte';
  import Chat from '$lib/Chat.svelte';
  import DiscordLoginHelper from '$lib/DiscordLoginHelper.svelte';
  import FloatingKeybinds from '$lib/FloatingKeybinds.svelte';
  import FreecamOverlay from '$lib/FreecamOverlay.svelte';
  import Hitmarker from '$lib/Hitmarker.svelte';
  import Menu from '$lib/Menu.svelte';
  import MicIcon from '$lib/MicIcon.svelte';
  import Modals from '$lib/Modals.svelte';
  import RegisterWindow from '$lib/RegisterWindow.svelte';
  import Speedometer from '$lib/Speedometer.svelte';
  import Toasts from '$lib/Toasts.svelte';
  import UsernameWindow from '$lib/UsernameWindow.svelte';
  import Wassermarke from '$lib/Wassermarke.svelte';
  // import WheelMenu from '$lib/WheelMenu.svelte';
  import Killfeed from '$lib/hud/Killfeed.svelte';
  import Killmessages from '$lib/hud/Killmessages.svelte';
  import { isHudActive } from '$lib/store/hud';
  import { onMount } from 'svelte';

  onMount(() => {
    alt.emit('ready');
    alt.on('hud:toggle', (toggle) => {
      isHudActive.set(toggle);
    });

    alt.on('openURL', (url) => {
      window.open(url, '_blank');
    });
  });

  // if (debug) {
  //   Object.assign(window.document.body.style, {
  //     backgroundImage: 'url("img/temp_gta.jpg")',
  //     backgroundSize: 'cover',
  //     backgroundPosition: 'center',
  //   });
  // }
</script>

<!-- HUD -->
<Toasts />
<FloatingKeybinds />
<Speedometer />
<MicIcon />
<Wassermarke />
<FreecamOverlay />
<Chat />
<Hitmarker />
<Killmessages />
<Killfeed />
<!-- UI ELEMENTS  -->
<RegisterWindow />
<UsernameWindow />
<DiscordLoginHelper />
<!-- Menu -->
<!-- <WheelMenu /> -->
<Menu />
<CharEditor />
<Modals />
