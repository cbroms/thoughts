const ce = "http://localhost:3000";

export const makeSearch = (query) => {
  return fetch(`${ce}/search/${query}`)
    .then((res) => res.json())
    .catch((e) => {
      error: true;
    });
};

export const getThought = (id) => {
  return fetch(`${ce}/thought/${id}/raw`)
    .then((res) => res.json())
    .catch((e) => {
      error: true;
    });
};

export const saveThought = (id, content) => {
  return fetch(`${ce}/thought/${id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(content),
  });
};

export const renameThought = (id, content) => {
  return fetch(`${ce}/thought/${id}/rename`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(content),
  });
};

export const indexThought = (id, add) => {
  return fetch(`${ce}/thought/${id}/index/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ index: add }),
  });
};

export const saveFile = (id, file) => {
  const body = new FormData();
  body.append("file1", file);

  return fetch(`${ce}/thought/${id}/file`, {
    method: "POST",
    body,
  });
};
