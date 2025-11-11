<script>
  import { onMount } from 'svelte';
  import { rooms, tags, loading, fetchRooms } from '$lib/roomsStore.js';
  import RoomCard from '$lib/components/RoomCard.svelte';

  let screenWidth = 0;

  // watch window resize
  onMount(() => {
    fetchRooms();
    screenWidth = window.innerWidth;
    window.addEventListener('resize', () => (screenWidth = window.innerWidth));
  });

  // Derived top/new models
  $: females = $rooms.filter(r => r.gender === 'f');
  $: topModels = [...females].sort((a, b) => b.num_users - a.num_users);
  $: newModels = females.filter(r => r.is_new);

  // 👇 reactive limit: 6 if mobile (<640px), otherwise 14
  $: visibleCount = screenWidth < 640 ? 6 : 14;
</script>


<main class="p-4 flex flex-col gap-12 bg-black text-white min-h-screen">

  <!-- 🏆 TOP MODELS -->
  <section class="border-t border-gray-800 pt-6">
    <div class="flex items-center justify-between mb-3">
      <h2 class="text-xl font-semibold text-white">Top Models</h2>
      <a href="/f" class="text-sm text-pink-500 hover:text-pink-400">Show All →</a>
    </div>

    {#if $loading}
      <p>Loading...</p>
    {:else}
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {#each topModels.slice(0, visibleCount) as room}
          <RoomCard {room} />
        {/each}
      </div>
    {/if}
  </section>

  <!-- 🆕 NEW MODELS -->
  <section class="border-t border-gray-800 pt-6">
    <div class="flex items-center justify-between mb-3">
      <h2 class="text-xl font-semibold text-white">New Models</h2>
      <a href="/f" class="text-sm text-pink-500 hover:text-pink-400">Show All →</a>
    </div>

    {#if $loading}
      <p>Loading...</p>
    {:else}
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {#each newModels.slice(0, visibleCount) as room}
          <RoomCard {room} />
        {/each}
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
