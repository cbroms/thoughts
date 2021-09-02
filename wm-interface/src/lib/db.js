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
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Success:", data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};
