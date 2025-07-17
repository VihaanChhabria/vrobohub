import { set, get } from "idb-keyval";

const fetchFromCache = async (
  dataRoute,
  updateStatusRoute,
  localStorageOrIndexedDB,
  headers = {}
) => {
  const lastClientUpdate = localStorage.getItem(updateStatusRoute) || null;
  const lastDBUpdate = await fetch(updateStatusRoute).then((res) => res.text());

  let data;

  // If the client has the latest data, return the cached data
  if (lastClientUpdate && lastClientUpdate === lastDBUpdate) {
    if (localStorageOrIndexedDB) {
      data = JSON.parse(localStorage.getItem(dataRoute));
    } else {
      data = await get(dataRoute);
    }
  } else {
    // If the client does not have the latest data, fetch the data from the server
    data = await fetch(dataRoute, headers).then((res) => res.json());

    // Cache the data locally
    if (localStorageOrIndexedDB) {
      localStorage.setItem(dataRoute, JSON.stringify(data));
      localStorage.setItem(updateStatusRoute, lastDBUpdate);
    } else {
      await set(dataRoute, data);
      localStorage.setItem(updateStatusRoute, lastDBUpdate);
    }
  }

  return data;
};

export default fetchFromCache;
