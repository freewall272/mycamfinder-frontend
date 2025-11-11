<script>
  import { onMount } from 'svelte';
  import { tags, fetchRooms } from '$lib/roomsStore.js';
  import { page } from '$app/stores';

  // Get current route (e.g., '/', '/f', '/m', etc.)
  $: currentPath = $page.url.pathname;

  // Fetch rooms/tags on mount (once)
  onMount(async () => {
    if ($tags.length === 0) await fetchRooms();
  });
</script>

<header class="w-full bg-black border-b border-gray-800 text-white">
  <!-- 🖼️ Logo -->
  <div class="flex items-center justify-center sm:justify-start px-6 py-3 border-b border-gray-800">
    <a href="/" class="flex items-center gap-3">
      <img src="/logo.png" alt="Logo" class="h-8 w-auto object-contain" />
      <h1 class="text-xl sm:text-2xl font-semibold tracking-wide">MyCamFinder</h1>
    </a>
  </div>

  <!-- 🌈 TAG SCROLLER -->
  <div class="px-4 py-2 bg-black">
    <div
      class="flex gap-2 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory scroll-smooth"
      style="scrollbar-width: none;"
    >
      {#each $tags as tag}
        <button
          class="snap-start whitespace-nowrap flex-shrink-0 cursor-pointer px-3 py-1.5 rounded-full bg-zinc-800 text-sm sm:text-base text-white hover:bg-pink-600 transition"
        >
          #{tag}
        </button>
      {/each}
    </div>
  </div>

  <!-- 🚻 GENDER LINKS -->
  <div class="flex justify-between gap-2 px-4 pb-3 overflow-x-auto border-t border-gray-800 bg-black">
    {#each [
      { label: 'Girls', value: 'f' },
      { label: 'Guys', value: 'm' },
      { label: 'Couples', value: 'c' },
      { label: 'Trans', value: 't' }
    ] as g}
      <a
        href={`/${g.value}`}
        class="flex-1 min-w-[70px] py-3 rounded-md font-semibold text-xs sm:text-sm uppercase tracking-wide text-center transition
          {currentPath === `/${g.value}` || (currentPath === '/' && g.value === 'f')
            ? 'bg-pink-600 text-white'
            : 'bg-gray-800 text-white hover:bg-pink-600 hover:text-white'}"
      >
        {g.label}
      </a>
    {/each}
  </div>
</header>

<style>
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
</style>
