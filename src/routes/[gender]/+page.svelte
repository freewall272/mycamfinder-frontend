<script>
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import {
    rooms,
    loading,
    fetchRooms,
    selectedGender,
    filteredRooms
  } from '$lib/roomsStore.js';

  import RoomCard from '$lib/components/RoomCard.svelte';

  $: gender = $page.params.gender;

  onMount(async () => {
    await fetchRooms();
    selectedGender.set(gender);
  });
</script>

<main class="p-6 bg-black min-h-screen text-white">
  <!-- Header -->
  <header class="flex items-center justify-between mb-6">
    <h1 class="text-2xl font-semibold capitalize">
      {gender === 'f' ? 'Girls'
      : gender === 'm' ? 'Guys'
      : gender === 'c' ? 'Couples'
      : gender === 't' ? 'Trans Models'
      : 'Models'}
    </h1>

    <a href="/" class="text-sm text-pink-500 hover:text-pink-400">← Back to Home</a>
  </header>

  <!-- 💃 MODEL GRID -->
  {#if $loading}
    <p>Loading...</p>
  {:else if $filteredRooms.length === 0}
    <p class="text-gray-400">No models found.</p>
  {:else}
    <div
      class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
    >
      {#each $filteredRooms as room}
        <RoomCard {room} />
      {/each}
    </div>
  {/if}
</main>
