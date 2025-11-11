<script>
  import { onMount } from 'svelte';
  import {
    rooms,
    tags,
    loading,
    fetchRooms
  } from '$lib/roomsStore.js';

  // Derived top/new models
  $: females = $rooms.filter(r => r.gender === 'f');
  $: topModels = [...females].sort((a, b) => b.num_users - a.num_users).slice(0, 20);
  $: newModels = females.filter(r => r.is_new).slice(0, 20);

  onMount(async () => {
    await fetchRooms();
  });
</script>

<!-- ✅ Header -->
<header class="w-full py-2 bg-black border-b border-gray-800 flex items-center justify-center sm:justify-start px-6">
  <a href="/" class="flex items-center gap-3">
    <img src="/logo.png" alt="Dimecams Logo" class="h-8 w-auto object-contain" />
    <h1 class="text-xl sm:text-2xl font-semibold text-white tracking-wide">MyCamFinder</h1>
  </a>
</header>

<main class="p-4 flex flex-col gap-2 bg-black text-white min-h-screen">
  <!-- 🌈 TAG SCROLLER -->
  <div class="relative">
    <div
      class="flex gap-2 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory scroll-smooth"
      style="scrollbar-width: none;"
    >
      {#each $tags as tag}
        <button class="snap-start whitespace-nowrap flex-shrink-0 cursor-pointer px-3 py-1.5 rounded-full bg-zinc-800 text-sm sm:text-base text-white hover:bg-pink-600 transition">
          #{tag}
        </button>
      {/each}
    </div>
  </div>

  <!-- ✅ GENDER LINKS -->
  <div class="flex justify-between gap-2 mt-2 w-full overflow-x-auto">
    {#each [
      { label: 'Girls', value: 'f' },
      { label: 'Guys', value: 'm' },
      { label: 'Couples', value: 'c' },
      { label: 'Trans', value: 't' }
    ] as g}
      <a
        href={`/${g.value}`}
        class="flex-1 min-w-[70px] py-3 rounded-md font-semibold text-xs sm:text-sm uppercase tracking-wide text-center
               bg-gray-800 text-white hover:bg-pink-600 hover:text-white transition"
      >
        {g.label}
      </a>
    {/each}
  </div>

  <!-- 🏆 TOP MODELS -->
  <section class="border-t border-gray-800 pt-6">
    <div class="flex items-center justify-between mb-3">
      <h2 class="text-xl font-semibold text-white">Top Models</h2>
      <a href="/top" class="text-sm text-pink-500 hover:text-pink-400">Show All →</a>
    </div>

    {#if $loading}
      <p>Loading...</p>
    {:else}
      <div class="overflow-x-auto pb-4 scrollbar-hide">
        <div class="grid grid-rows-2 auto-cols-[160px] grid-flow-col gap-4 snap-x snap-mandatory scroll-smooth">
          {#each topModels as room}
            <a
              href={room.chat_room_url_revshare}
              target="_blank"
              class="flex flex-col snap-start hover:opacity-90 transition border border-gray-800 rounded-lg overflow-hidden bg-gray-900"
            >
              <img src={room.image_url_360x270} alt={room.display_name} class="w-full h-[130px] object-cover" />
              <div class="p-2">
                <p class="text-sm font-semibold truncate text-white">{room.username}</p>
                <p class="text-xs text-gray-400">{room.age ? `${room.age} yrs` : 'Age hidden'}</p>
              </div>
            </a>
          {/each}
        </div>
      </div>
    {/if}
  </section>

  <!-- 🆕 NEW MODELS -->
  <section class="border-t border-gray-800 pt-6">
    <div class="flex items-center justify-between mb-3">
      <h2 class="text-xl font-semibold text-white">New Models</h2>
      <a href="/new" class="text-sm text-pink-500 hover:text-pink-400">Show All →</a>
    </div>

    {#if $loading}
      <p>Loading...</p>
    {:else}
      <div class="overflow-x-auto pb-4 scrollbar-hide">
        <div class="grid grid-rows-2 auto-cols-[160px] grid-flow-col gap-4 snap-x snap-mandatory scroll-smooth">
          {#each newModels as room}
            <a
              href={room.chat_room_url_revshare}
              target="_blank"
              class="flex flex-col snap-start hover:opacity-90 transition border border-gray-800 rounded-lg overflow-hidden bg-gray-900"
            >
              <img src={room.image_url_360x270} alt={room.display_name} class="w-full h-[130px] object-cover" />
              <div class="p-2">
                <p class="text-sm font-semibold truncate text-white">{room.username}</p>
                <p class="text-xs text-gray-400">{room.age ? `${room.age} yrs` : 'Age hidden'}</p>
              </div>
            </a>
          {/each}
        </div>
      </div>
    {/if}
  </section>

  <!-- 🏷️ TAGS SECTION -->
  <section class="border-t border-gray-800 pt-10 pb-16">
    <h2 class="text-xl font-semibold text-white text-center mb-6">Browse Tags</h2>
    <div class="max-w-5xl mx-auto text-center flex flex-wrap justify-center gap-3 text-gray-400">
      {#each $tags as tag}
        <a href={`/tags/${tag.toLowerCase()}`} class="hover:text-pink-400 transition">#{tag}</a>
      {/each}
    </div>
  </section>
</main>

<style>
  .tag {
    cursor: pointer;
    padding: 0.25rem 0.75rem;
    border-radius: 9999px;
    background-color: #27272a;
  }
  .tag.active {
    background-color: #ec4899;
  }
</style>
