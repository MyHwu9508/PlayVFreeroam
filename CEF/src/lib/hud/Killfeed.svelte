<script lang="ts">
  import { fly } from 'svelte/transition';
  import { isHudActive } from '$lib/store/hud';
  import type { KillFeedAnchors, KillFeedEntry } from '../../../../src/playv/shared/types/types';
  let visible = true;

  let feed: KillFeedEntry[] = [];
  let anchors: KillFeedAnchors = {
    left: 100,
    top: 1000,
    width: 300,
  };
  let c = 0;

  alt.on('pushKillfeed', pushKillfeed);
  alt.on('updateKillFeedAnchors', updateKillFeedAnchors);

  function updateKillFeedAnchors(data: KillFeedAnchors) {
    anchors = data;
  }

  // pushKillfeed({
  //   killerName: 'Killer',
  //   victimName: 'Victim',
  //   imageName: 'weapon_pistol',
  // });
  // pushKillfeed({
  //   killerName: 'LeonForGraphy',
  //   victimName: 'Victim',
  //   imageName: 'weapon_rpg',
  // });
  // pushKillfeed({
  //   killerName: 'bimbsdssdsdsdsdawdwa',
  //   victimName: 'bumbsdssdsdsdsdawdwa',
  //   imageName: 'causeOfDeath_vehicle',
  // });
  // pushKillfeed({
  //   killerName: 'tOMATENBAUMFUL123',
  //   victimName: 'bumbsdssdsdsdsdawdwa',
  //   imageName: 'causeOfDeath_fall',
  // });
  // pushKillfeed({
  //   killerName: 'tOMATENBAUMFUL123',
  //   victimName: 'bumbsdssdsdsdsdawdwa',
  //   imageName: 'weapon_molotov',
  // });

  function pushKillfeed(content: KillFeedEntry) {
    c++;
    content.id = c; // we add here an unique identifier to make sure the animations are executed properly c:
    feed.push(content);
    feed = feed;
    setTimeout(() => {
      feed.shift();
      feed = feed;
    }, 8000);
  }
</script>

{#if $isHudActive && visible}
  <div
    class="fixed flex justify-center gap-1 items-center pointer-events-none h-[20vh]"
    style="left:{anchors.left + 1}px; top:calc({anchors.top - 15}px - 20vh); width:{anchors.width}px"
  >
    <div class="w-full h-full flex flex-col-reverse gap-2">
      {#each feed as feedmsg (feedmsg.id)}
        <div
          class="h-[1.3rem] overflow-clip w-full flex flex-row justify-between gap-2 items-center p-1"
          in:fly={{ y: -20, duration: 200 }}
          out:fly={{ x: '-100%', duration: 300 }}
        >
          <p class="text-xs truncate flex-1 text-end">{feedmsg.killerName}</p>
          <div class="h-[1.3rem] w-[4rem] flex items-center justify-center">
            <img src="img/weapons/{feedmsg.imageName}.png" class="max-h-[1.3rem] max-w-[4rem]" alt="" />
          </div>
          <p class="text-xs truncate flex-1 text-start">{feedmsg.victimName}</p>
        </div>
      {/each}
    </div>
  </div>
{/if}
