<script lang="ts">
  import { closeCardSidebar, generateSidebarImage, replyToSidebarMessage } from '$lib/services/sidebarServices';
  import { boardStore, dialogStore } from '../../svelteBridge';
  import type { Message } from '$lib/types/sidebar';
  import { fade, fly } from 'svelte/transition';
  import { tick, onMount } from 'svelte';
  import { Send, X } from 'lucide-svelte';

  let messages: Message[] = [];
  let loading = false;
  let imgLoading = false;
  let newMessage = '';
  let image_src = '';
  let historyEl: HTMLDivElement;
  let textareaEl: HTMLTextAreaElement;

  $: openId = $dialogStore.cardSidebarOpen;

  $: if (openId) {
    const context = $boardStore.cards.find(c => c.id === openId)?.content ?? '';
    messages = [
      {
        id: Date.now().toString(),
        role: 'ai',
        content: context,
        createdAt: new Date().toISOString()
      }
    ];
    void handleImageLoad();
  }

  async function handleImageLoad() {
    if (!openId) return;

    imgLoading = true;

    const [src] = await Promise.all([
      generateSidebarImage(openId),
      new Promise(r => setTimeout(r, 10_000))
    ]);

    image_src = src;
    imgLoading = false;
  }

  function autoGrow() {
    if (!textareaEl) return;
    textareaEl.style.height = '0px';
    textareaEl.style.height = textareaEl.scrollHeight + 'px';
  }

  async function send() {
    if (!newMessage.trim()) return;
    messages = [
      ...messages,
      {
        id: Date.now().toString(),
        role: 'user',
        content: newMessage,
        createdAt: new Date().toISOString()
      }
    ];

    newMessage = '';
    autoGrow();
    loading = true;

    const response = await replyToSidebarMessage(messages);

    if (response) {
      messages = [
        ...messages,
        {
          id: Date.now().toString(),
          role: 'ai',
          content: response,
          createdAt: new Date().toISOString()
        }
      ];
    }

    await tick();
    historyEl?.scrollTo({ top: historyEl.scrollHeight, behavior: 'smooth' });
    loading = false;
  }

  function handleClose() {
    image_src = '';
    closeCardSidebar();
  }

  onMount(autoGrow);
</script>

<style>
  @keyframes shimmer {
    0% {
      background-position: -1000px 0;
    }
    100% {
      background-position: 1000px 0;
    }
  }

  .loader {
    background: linear-gradient(130deg, #0f172a 20%, #334155 40%, #0f172a 60%);
    background-size: 1000px 100%;
    animation: shimmer 2s linear infinite;
  }

  .thin-scrollbar::-webkit-scrollbar {
    width: 6px;
  }
  .thin-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }
  .thin-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.25);
    border-radius: 3px;
  }
</style>

<div
  class="z-100 glass fixed right-0 top-0 z-50 flex h-screen w-[430px] flex-col border-l border-white/10 bg-gradient-to-br from-slate-900/60 via-indigo-900/40 to-sky-950/60 backdrop-blur-xl shadow-2xl backdrop-saturate-200"
  in:fly={{ x: 0, duration: 250 }}
  out:fly={{ x: 500, duration: 250 }}
>
  <!-- Cover with placeholder -->
  <div class="relative h-[220px] w-full shrink-0 overflow-hidden">
    {#if imgLoading}
      <div class="loader absolute inset-0 flex items-center justify-center">
        <svg class="h-10 w-10 animate-spin text-indigo-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/></svg>
      </div>
    {:else if image_src}
      <img src={image_src} alt="Cover" class="h-full w-full object-cover brightness-90" />
    {/if}

    <button
      on:click={handleClose}
      class="absolute right-4 top-4 rounded-full bg-white/10 p-2 backdrop-blur-sm hover:bg-white/20"
    >
      <X class="h-4 w-4 text-white" />
    </button>
  </div>

  <!-- Messages -->
  <div
    bind:this={historyEl}
    class="thin-scrollbar flex-1 overflow-y-auto px-6 py-4"
  >
    {#each messages as m (m.id)}
      <p
        class={`mb-5 max-w-prose rounded-lg px-4 py-2 leading-relaxed backdrop-blur-md backdrop-brightness-110 ${
          m.role === 'ai'
            ? 'self-start bg-white/10 text-indigo-200'
            : 'self-end bg-indigo-600/80 text-white'
        }`}
        in:fade={{ duration: 300 }}
      >
        {m.content}
      </p>
    {/each}

    {#if loading}
      <p class="mb-4 italic text-indigo-300">…thinking…</p>
    {/if}
  </div>

  <form
    on:submit|preventDefault={send}
    class="relative border-t border-white/10 bg-slate-950/70 p-4 backdrop-blur-md"
  >
    <textarea
      bind:this={textareaEl}
      bind:value={newMessage}
      on:input={autoGrow}
      rows="1"
      placeholder="Let your creativity flow…"
      class="w-full resize-none rounded-lg bg-slate-800/70 p-3 pr-9 text-sm text-indigo-50 placeholder-indigo-400 outline-none focus:bg-slate-800/90"
    ></textarea>

    <button
      type="submit"
      class="absolute bottom-7 right-6 rounded-full bg-gradient-to-br from-indigo-500 via-sky-500 to-fuchsia-500 p-2 shadow-lg transition hover:scale-105 disabled:opacity-40"
      disabled={loading || !newMessage.trim()}
    >
      {#if loading}
        <svg class="h-3 w-3 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 2a10 10 0 0 0 0 20" /></svg>
      {:else}
        <Send class="h-3 w-3 -rotate-45 text-white" />
      {/if}
    </button>
  </form>
</div>
