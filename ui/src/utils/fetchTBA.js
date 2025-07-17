import { set, get } from "idb-keyval";

const fetchTBA = async (url) => {
  const cacheKey = `${url}_data`;
  const etagKey = `${url}_etag`;

  const response = await fetch(url, {
    headers: {
      "X-TBA-Auth-Key": import.meta.env.VITE_TBA_AUTH_KEY,
      "If-None-Match": (await get(etagKey)) || "",
    },
  });

  if (response.status === 304) {
    // Not Modified, return cached data
    const cached = await get(cacheKey);
    return cached ? cached : null;
  } else if (response.ok) {
    const data = await response.json();
    const etag = response.headers.get("ETag");

    // Save new data and ETag
    await set(cacheKey, data);

    if (etag) {
      await set(etagKey, etag);
    }

    return data;
  } else {
    throw new Error(`TBA fetch failed: ${response.status}`);
  }
};

export default fetchTBA;
