const REBRICKABLE_API_KEY = process.env.REBRICKABLE_API_KEY;
const BASE_URL = 'https://rebrickable.com/api/v3';

async function fetchWithAuth(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const headers = {
    'Authorization': `key ${REBRICKABLE_API_KEY}`,
    'Accept': 'application/json',
    ...options.headers,
  };

  const response = await fetch(url, { ...options, headers });

  if (!response.ok) {
    throw new Error(`Rebrickable API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

// Search for parts by name or description
export async function searchParts(query, page = 1, pageSize = 20) {
  try {
    const data = await fetchWithAuth(
      `/lego/parts/?search=${encodeURIComponent(query)}&page=${page}&page_size=${pageSize}`
    );

    return {
      count: data.count,
      parts: data.results.map(part => ({
        partNum: part.part_num,
        name: part.name,
        category: part.part_cat_id,
        imageUrl: part.part_img_url,
        url: part.part_url,
      })),
    };
  } catch (error) {
    console.error('Error searching parts:', error);
    // Return empty results if API key is not configured
    return { count: 0, parts: [], error: 'Rebrickable API not configured' };
  }
}

// Get details for a specific part number
export async function getPartDetails(partNum) {
  try {
    const part = await fetchWithAuth(`/lego/parts/${partNum}/`);
    const colors = await fetchWithAuth(`/lego/parts/${partNum}/colors/`);

    return {
      partNum: part.part_num,
      name: part.name,
      category: part.part_cat_id,
      imageUrl: part.part_img_url,
      url: part.part_url,
      yearFrom: part.year_from,
      yearTo: part.year_to,
      availableColors: colors.results.map(c => ({
        colorId: c.color_id,
        colorName: c.color_name,
        numSets: c.num_sets,
        numSetParts: c.num_set_parts,
        imageUrl: c.part_img_url,
      })),
    };
  } catch (error) {
    console.error('Error getting part details:', error);
    return { error: 'Could not fetch part details' };
  }
}

// Get sets that contain a specific part
export async function getSetsWithPart(partNum, page = 1, pageSize = 10) {
  try {
    // First get the part colors to find sets
    const colors = await fetchWithAuth(`/lego/parts/${partNum}/colors/`);

    if (colors.results.length === 0) {
      return { count: 0, sets: [] };
    }

    // Get sets for the first available color
    const firstColor = colors.results[0];
    const setsData = await fetchWithAuth(
      `/lego/parts/${partNum}/colors/${firstColor.color_id}/sets/?page=${page}&page_size=${pageSize}`
    );

    return {
      count: setsData.count,
      sets: setsData.results.map(item => ({
        setNum: item.set_num,
        name: item.set_name,
        year: item.set_year,
        numParts: item.set_num_parts,
        imageUrl: item.set_img_url,
        quantity: item.quantity,
        instructionsUrl: `https://rebrickable.com/sets/${item.set_num}/`,
      })),
    };
  } catch (error) {
    console.error('Error getting sets with part:', error);
    return { count: 0, sets: [], error: 'Could not fetch sets' };
  }
}

// Get building instructions for a set
export async function getSetInstructions(setNum) {
  try {
    const set = await fetchWithAuth(`/lego/sets/${setNum}/`);

    return {
      setNum: set.set_num,
      name: set.name,
      year: set.year,
      numParts: set.num_parts,
      imageUrl: set.set_img_url,
      url: set.set_url,
      instructionsUrl: `https://rebrickable.com/instructions/${set.set_num}/`,
    };
  } catch (error) {
    console.error('Error getting set instructions:', error);
    return { error: 'Could not fetch set instructions' };
  }
}
