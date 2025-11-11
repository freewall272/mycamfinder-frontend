import { writable, derived } from 'svelte/store';

export const rooms = writable([]);
export const tags = writable([]);
export const loading = writable(false);
export const selectedTag = writable(null);
export const selectedGender = writable(null);

const allowedTags = [
  "alt","anal","asian","ass","blonde","bigtits","brunette","cosplay","curvy","english","feet",
  "deepthroat","fuckmachine","goth","halloween","latina","lesbian","love","new","petite","pussy",
  "teen","tattoos","pawg","redhead","milf","18","solo","tattoo","piercing","fit","cosplay",
  "gaming","lingerie","yoga"
];

// 🧩 Fetch and populate the rooms and tags
export async function fetchRooms() {
  loading.set(true);
  try {
    const res = await fetch("https://api.dimecams.com/api/rooms");
    const data = await res.json();
    const results = data.results || [];
    rooms.set(results);

    const tagSet = new Set();
    results.forEach(room => {
      room.tags?.forEach(tag => {
        const lower = tag.toLowerCase();
        if (allowedTags.includes(lower)) tagSet.add(tag);
      });
    });
    tags.set([...tagSet].sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' })));
  } catch (err) {
    console.error("Failed to fetch rooms:", err);
  } finally {
    loading.set(false);
  }
}

// 💡 Derived store that filters based on current selections
export const filteredRooms = derived(
  [rooms, selectedTag, selectedGender],
  ([$rooms, $selectedTag, $selectedGender]) => {
    let filtered = $rooms;

    if ($selectedGender) {
      filtered = filtered.filter(r => r.gender === $selectedGender);
    }

    if ($selectedTag) {
      const tagLower = $selectedTag.toLowerCase();
      filtered = filtered.filter(r =>
        r.tags?.some(t => t.toLowerCase() === tagLower)
      );
    }

    return filtered;
  }
);
