<script lang="ts">
  import type { Input } from '../../../../../../src/playv/client/ui/menu/framework/components/Input';
  export let comp: Input;
  let input: HTMLInputElement;
  let keyin = false;
  $: comp?.active && input && activate();
  function activate() {
    keyin = false;
    input.focus();
  }
  function handleFinish(e: KeyboardEvent) {
    if (!keyin) return;
    if (e.key === 'Enter') {
      alt.emit('comp:finish', true);
    } else if (e.key === 'Escape') {
      alt.emit('comp:finish', false);
    }
  }
  function handleInput(e: Event) {
    alt.emit('comp:input', (e.target as HTMLInputElement).value);
  }
</script>

<div
  class="px-gap flex items-center justify-between w-[201%] transition-transform {comp.active
    ? '-translate-x-[50%]'
    : '-translate-x-0'}"
>
  <div class="w-1/2 px-2 gap-2 flex justify-between">
    <span class="whitespace-nowrap">{comp.text}</span>
    <span class="truncate underline">{comp.value}</span>
  </div>
  <div class="w-1/2 h-8 bg-surface-500 grid grid-cols-[auto_1fr_auto] items-center">
    <div class="bg-error-500 p-1">Esc</div>
    <input
      type="text"
      class="input w-full h-[2rem] -mb-[1px] !rounded-none"
      value={comp.value}
      maxlength={comp.maxLength}
      bind:this={input}
      on:keyup={handleFinish}
      on:keydown={() => (keyin = true)}
      on:input={handleInput}
      on:blur={() => comp.active && input.focus()}
    />
    <div class="bg-success-600/80 p-1">Enter</div>
  </div>
</div>
