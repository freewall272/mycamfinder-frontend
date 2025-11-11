<script>
  import { onMount } from 'svelte';

  let rooms = [];
  let visibleRooms = [];
  let tags = [];
  let selectedTag = ['teen', '18', 'blonde'];
  let selectedGender = 'all';
  let loading = false;
  let chunkSize = 40;
  let loadedCount = 0;
    let tagScroller;

  const allowedTags = [
    "alt","anal","asian","ass","blonde","bigtits","brunette","cosplay","curvy","english","feet",
    "deepthroat","fuckmachine","goth","halloween","latina","lesbian","love","new","petite","pussy",
    "teen","tattoos","pawg","redhead","milf","18","solo","tattoo","piercing","fit","cosplay",
    "gaming","lingerie","yoga"
  ];

  onMount(async () => {
    await fetchData();
    refresh();
    window.addEventListener('scroll', handleScroll);
  });

  async function fetchData() {
    loading = true;
    try {
      const res = await fetch("https://api.dimecams.com/api/rooms");
      const data = await res.json();
      rooms = data.results;
      collectTags();
    } catch (err) {
      console.error(err);
    } finally {
      loading = false;
    }
  }

  function collectTags() {
    const set = new Set();
    rooms.forEach(room => {
      room.tags?.forEach(tag => {
        const lower = tag.toLowerCase();
        if (allowedTags.includes(lower)) set.add(tag);
      });
    });
    tags = Array.from(set).sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
  }

  function selectTag(tag) {
    selectedTag = [tag];
    refresh();
  }

  function filterRooms() {
    let filtered = rooms;
    if (selectedTag.length > 0) {
      const tagList = selectedTag.map(t => t.toLowerCase());
      filtered = filtered.filter(r =>
        r.tags?.some(t => tagList.includes(t.toLowerCase()))
      );
    }
    if (selectedGender !== 'all') {
      filtered = filtered.filter(r => r.gender === selectedGender);
    } else {
      filtered = filtered.filter(r => r.gender !== 'c');
    }
    return filtered;
  }

  function refresh() {
    loadedCount = 0;
    const filtered = filterRooms();
    visibleRooms = filtered.slice(0, chunkSize);
    loadedCount = visibleRooms.length;
  }

  function loadMore() {
    const filtered = filterRooms();
    if (loadedCount < filtered.length) {
      const next = filtered.slice(loadedCount, loadedCount + chunkSize);
      visibleRooms = [...visibleRooms, ...next];
      loadedCount += chunkSize;
    }
  }

  function handleScroll() {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 400) {
      loadMore();
    }
  }



  function scrollTags(direction) {
    if (!tagScroller) return;
    const scrollAmount = 300; // pixels per click
    tagScroller.scrollBy({
      left: direction * scrollAmount,
      behavior: 'smooth'
    });
  }

</script>

<style>
  main {
    background-color: black;
    color: white;
    min-height: 100vh;
  }
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 1rem;
  }
  img {
    width: 100%;
    border-radius: 0.5rem;
    object-fit: cover;
  }
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
<!-- 🌐 Site Header / Logo -->
<header class="w-full py-6 bg-black border-b border-gray-800 flex items-center justify-center sm:justify-start px-6">
  <a href="/" class="flex items-center gap-3">
    <img src="/logo.png" alt="Dimecams Logo" class="h-10 w-auto object-contain" />
    <h1 class="text-xl sm:text-2xl font-semibold text-white tracking-wide">MyCamFinder</h1>
  </a>
</header>


<main class="p-6 flex flex-col gap-16">

 <!-- 🌸 SECTION 1: Cams + Navigation -->
<section id="cams" class="space-y-6">
  <h1 class="text-3xl font-bold mb-2">Live Models</h1>

  <!-- 🌈 HORIZONTAL TAG SCROLLER with arrows -->
  <div class="relative">
    <!-- Left Arrow -->
    <button
      on:click={() => scrollTags(-1)}
      class="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/60 hover:bg-black/80 text-white px-2 py-2 rounded-full backdrop-blur-sm hidden sm:block"
    >
      ◀
    </button>

    <!-- Right Arrow -->
    <button
      on:click={() => scrollTags(1)}
      class="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/60 hover:bg-black/80 text-white px-2 py-2 rounded-full backdrop-blur-sm hidden sm:block"
    >
      ▶
    </button>

    <!-- Optional fade edges -->
    <div class="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-black to-transparent pointer-events-none"></div>
    <div class="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-black to-transparent pointer-events-none"></div>

    <!-- Scrollable tag list -->
    <div
      bind:this={tagScroller}
      class="flex gap-2 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory scroll-smooth"
      style="scrollbar-width: none;"
    >
      {#each tags as tag}
        <button
          class="tag snap-start whitespace-nowrap flex-shrink-0 {selectedTag.includes(tag) ? 'active' : ''}"
          on:click={() => selectTag(tag)}
        >
          #{tag}
        </button>
      {/each}
    </div>
  </div>

  <!-- Navigation Buttons -->
  <div class="flex flex-wrap gap-3 mt-4">
    <button class="px-4 py-2 rounded-full bg-pink-600 hover:bg-pink-500 text-white font-semibold text-sm">Top Rated</button>
    <button class="px-4 py-2 rounded-full bg-gray-700 hover:bg-gray-600 text-white font-semibold text-sm">Newest</button>
    <button class="px-4 py-2 rounded-full bg-gray-700 hover:bg-gray-600 text-white font-semibold text-sm">Trending</button>
    <button class="px-4 py-2 rounded-full bg-gray-700 hover:bg-gray-600 text-white font-semibold text-sm">HD Only</button>
  </div>

  <!-- Room Grid -->
  <div class="grid max-h-[600px] overflow-y-auto border-t border-gray-800 pt-4">
    {#if loading}
      <p>Loading...</p>
    {:else}
      {#each visibleRooms as room}
        <a href={room.chat_room_url_revshare} target="_blank" class="block">
          <img src={room.image_url_360x270} alt={room.display_name} />
          <p class="mt-1 text-sm font-semibold truncate">{room.display_name}</p>
          <p class="text-xs text-gray-400">{room.num_users} viewers</p>
        </a>
      {/each}
    {/if}
  </div>
</section>



  <!-- 🌐 SECTION 2: Review Page Links -->
  <section id="reviews" class="bg-gray-950 py-10 px-4 rounded-lg border border-gray-800">
    <h2 class="text-2xl font-semibold mb-6 text-white">Model Review Pages</h2>
    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      <a href="/reviews/blonde" class="block bg-gray-800 hover:bg-gray-700 rounded-lg p-4 text-center transition">
        <p class="font-semibold text-white">Blonde Models</p>
        <p class="text-sm text-gray-400">Reviews & ratings</p>
      </a>
      <a href="/reviews/teen" class="block bg-gray-800 hover:bg-gray-700 rounded-lg p-4 text-center transition">
        <p class="font-semibold text-white">Teen Models</p>
        <p class="text-sm text-gray-400">Viewer favorites</p>
      </a>
      <a href="/reviews/asian" class="block bg-gray-800 hover:bg-gray-700 rounded-lg p-4 text-center transition">
        <p class="font-semibold text-white">Asian Models</p>
        <p class="text-sm text-gray-400">Trending now</p>
      </a>
      <a href="/reviews/latina" class="block bg-gray-800 hover:bg-gray-700 rounded-lg p-4 text-center transition">
        <p class="font-semibold text-white">Latina Models</p>
        <p class="text-sm text-gray-400">Top ranked</p>
      </a>
    </div>
  </section>

  <!-- 🖼️ SECTION 3: Text + Image -->
  <section id="about" class="flex flex-col md:flex-row items-center gap-8 bg-gray-950 border border-gray-800 rounded-lg p-6">
    <div class="md:w-1/2">
      <h2 class="text-2xl font-semibold mb-3 text-white">About Dimecams</h2>
      <p class="text-gray-400 leading-relaxed">
        Dimecams brings you the hottest live cam streams from across the web — updated in real time.  
        Browse by tag, region, or popularity, and discover new models every day.  
        Our platform helps fans connect directly with verified performers and affiliate networks safely.
      </p>
      <a href="/about" class="inline-block mt-5 px-5 py-2 bg-pink-600 hover:bg-pink-500 rounded-full font-semibold text-white">
        Learn More
      </a>
    </div>

    <div class="md:w-1/2 flex justify-center">
      <img src="/hero-image.jpg" alt="Live Models" class="rounded-lg w-full max-w-md border border-gray-700 shadow-lg" />
    </div>
  </section>

  <!-- 🏷️ SECTION 4: Tag Text Grid -->
  <section id="taglist" class="py-12 border-t border-gray-800">
    <h2 class="text-2xl font-semibold mb-4 text-white text-center">Browse Tags</h2>
    <div class="max-w-5xl mx-auto text-center flex flex-wrap justify-center gap-3 text-gray-400">
      {#each tags as tag}
        <a href={`/tags/${tag.toLowerCase()}`} class="hover:text-pink-400 transition">#{tag}</a>
      {/each}
    </div>
  </section>

</main>
