import slugify from "slugify";

export const toId = (name) => {
  if (name !== "new thought") {
    return slugify(name, { strict: true }).toLowerCase();
  }
};
export const toFileName = (name) => {
  if (name !== "new thought") {
    return toId(name) + ".md";
  }
  return name;
};
