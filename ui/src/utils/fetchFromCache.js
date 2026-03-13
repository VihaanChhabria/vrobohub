import { set, get } from "idb-keyval";

const fetchFromCache = async (
  dataRoute,
  updateStatusRoute,
  localStorageOrIndexedDB,
  query = {},
) => {
  const queryString = new URLSearchParams(query).toString();
  const fullDataURL = queryString ? `${dataRoute}?${queryString}` : dataRoute;
  const fullUpdateStatusURL = queryString
    ? `${updateStatusRoute}?${queryString}`
    : updateStatusRoute;

  const lastClientUpdate = localStorage.getItem(fullUpdateStatusURL) || null;
  const lastDBUpdate = await fetch(fullUpdateStatusURL).then((res) =>
    res.text(),
  );

  let data;

  // If the client has the latest data, return the cached data
  if (lastClientUpdate && lastClientUpdate === lastDBUpdate) {
    if (localStorageOrIndexedDB) {
      data = JSON.parse(localStorage.getItem(fullDataURL));
    } else {
      data = await get(fullDataURL);
    }
  } else {
    // If the client does not have the latest data, fetch the data from the server
    data = await fetch(fullDataURL).then((res) => res.json());

    // Cache the data locally
    if (localStorageOrIndexedDB) {
      localStorage.setItem(fullDataURL, JSON.stringify(data));
      localStorage.setItem(fullUpdateStatusURL, lastDBUpdate);
    } else {
      await set(fullDataURL, data);
      localStorage.setItem(fullUpdateStatusURL, lastDBUpdate);
    }
  }

  return data;
};

export default fetchFromCache;
