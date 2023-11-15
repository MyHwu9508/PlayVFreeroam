<script lang="ts">
  import { isHudActive } from './store/hud';
  let hitMarkerVisible = false;

  alt.on('hitmarker:show', showHitMarker);
  function showHitMarker() {
    hitMarkerVisible = true;

    setTimeout(() => {
      hitMarkerVisible = false;
    }, 50);
  }
</script>

{#if $isHudActive && hitMarkerVisible}
  <div class="hitmarker">
    <img class="hitmarkerImg" src="img/hitmarker.png" alt="" />
  </div>
{/if}

<style>
  .hitmarker {
    position: absolute;
    top: 50%;
    left: 50%;

    margin-left: -50px;
    margin-top: -50px;
  }

  .hitmarkerImg {
    width: 100px;
    height: 100px;
  }
</style>
