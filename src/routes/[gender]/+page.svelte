<script>
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import {
    rooms,
    tags,
    loading,
    fetchRooms,
    selectedTag,
    selectedGender,
    filteredRooms
  } from '$lib/roomsStore.js';

  $: gender = $page.params.gender;

  onMount(async () => {
    await fetchRooms();
    selectedGender.set(gender);
    selectedTag.set(null); // clear any previous tag filter
  });

  function filterByTag(tag) {
    selectedTag.set(tag === $selectedTag ? null : tag);
  }
</script>

<main class="p-6 bg-black min-h-screen text-white">
  <!-- Header -->
  <header class="flex items-center justify-between mb-6">
    <h1 class="text-2xl font-semibold">
      {gender === 'f' ? 'Girls'
      : gender === 'm' ? 'Guys'
      : gender === 'c' ? 'Couples'
      : gender === 't' ? 'Trans Models'
      : 'Models'}
    </h1>
    <a href="/" class="text-sm text-pink-500 hover:text-pink-400">← Back to Home</a>
  </header>

  <!-- 🌈 TAG SCROLLER -->
  <div
    class="flex gap-2 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory scroll-smooth mb-8"
    style="scrollbar-width: none;"
  >
    {#each $tags as tag}
      <button
        class="tag snap-start whitespace-nowrap flex-shrink-0 transition-colors duration-150
               { $selectedTag === tag ? 'bg-pink-600' : 'bg-gray-700 hover:bg-gray-600' }"
        on:click={() => filterByTag(tag)}
      >
        #{tag}
      </button>
    {/each}
  </div>

  <!-- 💃 MODEL GRID -->
  {#if $loading}
    <p>Loading...</p>
  {:else if $filteredRooms.length === 0}
    <p class="text-gray-400">No models found.</p>
  {:else}
    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {#each $filteredRooms as room}
        <a
          href={room.chat_room_url_revshare}
          target="_blank"
          class="block hover:opacity-90 transition border border-gray-800 rounded-lg overflow-hidden bg-gray-900"
        >
          <img
            src={room.image_url_360x270}
            alt={room.display_name}
            class="w-full h-[180px] object-cover"
          />
          <div class="p-2">
            <p class="text-sm font-semibold truncate text-white">{room.username}</p>
            <p class="text-xs text-gray-400">
              {room.age ? `${room.age} yrs` : 'Age hidden'}
            </p>
          </div>
        </a>
      {/each}
    </div>
  {/if}
</main>

<style>
  img {
    border-radius: 0.5rem;
  }
  .tag {
    cursor: pointer;
    padding: 0.25rem 0.75rem;
    border-radius: 9999px;
    color: white;
    white-space: nowrap;
  }
</style>
