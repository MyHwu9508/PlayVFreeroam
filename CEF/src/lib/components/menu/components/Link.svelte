<script lang="ts">
  import type { PageLink } from '../../../../../../src/playv/client/ui/menu/framework/components/PageLink';
  export let comp: PageLink;
</script>

<div class="flex justify-between w-full px-2">
  <span class="truncate">{comp.text}</span><span class="i-carbon-direction-straight-right icon text-lg" />
</div>
