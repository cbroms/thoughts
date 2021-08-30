const ce = "http://localhost:3000";

export const makeSearch = (query) => {
  return fetch(`${ce}/search/${query}`)
    .then((res) => res.json())
    .catch((e) => {
      error: true;
    });
};