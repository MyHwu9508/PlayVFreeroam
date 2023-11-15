<script lang="ts">
  import { afterUpdate, onDestroy, onMount } from 'svelte';
  import { fade } from 'svelte/transition';
  import { isHudActive } from './store/hud';
  type ChatMessage = {
    username: string;
    text: string;
    tagColor: string;
    range: string;
    iconURL: string;
    tag: string;
    longTag: string;
  };

  let iInputBar: HTMLInputElement;
  let ichatContent: HTMLDivElement;

  let inputOpen = false;
  let visible = true;
  let inputBarContent = '';
  let currentRange = 1;
  let chatRanges = ['Near', 'Lobby', 'Global'];
  let messages: ChatMessage[] = [];
  let buffer: string[] = [];
  let currentBufferIndex = -1;

  let hideTimeout: number | undefined;

  function runTimeoutHandshake() {
    if (hideTimeout) clearTimeout(hideTimeout);
    hideTimeout = undefined;

    hideTimeout = setTimeout(() => {
      visible = false;
    }, 15000);
  }

  function pauseTimeoutHandshake() {
    if (hideTimeout) clearTimeout(hideTimeout);
    hideTimeout = undefined;
  }

  function handleKeyUp(e: KeyboardEvent) {
    if (!inputOpen) return;
    switch (e.key) {
      case 'Tab':
        e.preventDefault();
        currentRange++;
        if (currentRange > chatRanges.length - 1) currentRange = 0;
        break;

      case 'Enter':
        window.alt?.emit('confirmChat', inputBarContent, chatRanges[currentRange]);
        inputOpen = false;
        if (inputBarContent.trim().length > 0) saveBuffer();
        inputBarContent = '';
        runTimeoutHandshake();
        break;

      case 'Escape':
        window.alt?.emit('confirmChat');
        inputOpen = false;
        inputBarContent = '';
        runTimeoutHandshake();
        break;
    }
    if (e.keyCode == 40) {
      e.preventDefault();
      if (currentBufferIndex > 0) {
        loadBuffer(--currentBufferIndex);
      } else if (currentBufferIndex == 0) {
        currentBufferIndex = -1;
        inputBarContent = '';
      }
    } else if (e.keyCode == 38) {
      e.preventDefault();
      if (currentBufferIndex < buffer.length - 1) {
        loadBuffer(++currentBufferIndex);
      }
    }
  }

  alt.on('toggleChat', toggleChat);
  alt.on('chatRange:ADD', addChatRange);
  alt.on('pushChatMessage', pushChatMessage);

  function pushChatMessage(message: ChatMessage) {
    messages.push(message);
    messages = messages;

    setTimeout(() => {
      // not scrolling down idk
      if (visible && ichatContent) {
        ichatContent.scrollTop = ichatContent.scrollHeight;
      }
    }, 500);

    if (!inputOpen) {
      visible = true;
      runTimeoutHandshake();
    }
  }

  function addChatRange(range: string) {
    chatRanges.push(range);
    chatRanges = chatRanges;
  }

  function toggleChat(state: boolean) {
    inputOpen = state;
    if (state) {
      visible = true;
      pauseTimeoutHandshake();
    } else {
      runTimeoutHandshake();
    }
  }

  function saveBuffer() {
    if (buffer.length > 100) {
      buffer.pop();
    }

    buffer.unshift(inputBarContent);
    currentBufferIndex = -1;
  }

  function loadBuffer(idx: number) {
    inputBarContent = buffer[idx];
  }

  //reactive
  $: if (inputOpen && iInputBar && currentRange !== undefined) {
    iInputBar?.focus();
    ichatContent.scrollTop = ichatContent.scrollHeight;
  }

  afterUpdate(() => {
    if (visible && !inputOpen && ichatContent) {
      ichatContent.scrollTop = ichatContent.scrollHeight;
    }
  });
</script>

{#if visible && $isHudActive}
  <div
    class="chatContainer fixed left-2 top-2 h-[23vh] w-[25vw] max-w-[40rem]"
    style="text-shadow: 1px 1px 1px black !important;"
    class:chatClosed={!inputOpen}
    transition:fade={{ duration: 250 }}
  >
    <div
      class="chatContent h-full w-full min-w-full overflow-scroll overflow-x-hidden"
      class:chatClosedContent={!inputOpen}
      bind:this={ichatContent}
      class:chatOverflowed={messages.length > 8}
    >
      {#each messages as message}
        <div class="chatMessage flex select-none flex-row items-center gap-1 break-keep">
          {#if message.iconURL}
            <img src={message.iconURL} class="h-8 w-8 rounded-full" alt="" />
          {/if}
          {#if message.longTag && inputOpen}
            <p class="tag font-bold" style="color: {message.tagColor};">{message.longTag}</p>
          {/if}
          {#if message.tag && !inputOpen}
            <p class="tag font-bold" style="color: {message.tagColor};">{message.tag}</p>
          {/if}
          {#if inputOpen}
            <p class="username font-bold" style="color:white;">{message.username}</p>
          {:else}
            <p class="username font-bold" style="color:white;">{message.username}:</p>
          {/if}

          {#if inputOpen}
            <p class="location font-bold" style="color:white;">@{message.range}:</p>
          {/if}
          <p class="break-words" style="color:white;">{@html message.text}</p>
        </div>
      {/each}
    </div>

    {#if inputOpen}
      <div class="chatManager">
        <input
          class="input rounded-token p-1 px-2"
          style="background-color: rgb(var(--color-surface-600)); opacity:90%;"
          bind:value={inputBarContent}
          bind:this={iInputBar}
          placeholder="Press TAB to change the range!"
          maxlength="300"
        />

        <div class="chatManagerRanges mt-1 flex flex-row gap-2">
          {#each chatRanges as chatRange, index}
            <p
              class="rounded-token text-surface-300 pl-3 pr-3 font-bold shadow-xl {index === currentRange
                ? 'bg-success-700/90'
                : 'bg-surface-600/90'}"
            >
              {chatRange}
            </p>
          {/each}
        </div>
      </div>
    {/if}
  </div>
{/if}

<svelte:window on:keyup={handleKeyUp} />

<style>
  input::placeholder {
    color: rgb(var(--color-surface-300));
    opacity: 1;
    font-weight: 500;
  }
  .chatMessage {
    padding-top: 0.1rem;
    padding-bottom: 0.1rem;
  }

  .chatClosed {
    filter: brightness(0.9);
    animation: fadeOut 0.3s;
  }

  .chatClosedContent {
    overflow: hidden;
  }
  .chatOverflowed {
    -webkit-mask-image: -webkit-linear-gradient(top, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 1) 20%, rgba(0, 0, 0, 1) 100%);
  }

  @keyframes fadeOut {
    0% {
      filter: none;
    }
    100% {
      filter: brightness(0.9);
    }
  }
</style>
