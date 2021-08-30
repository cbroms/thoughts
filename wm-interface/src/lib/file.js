import slugify from "slugify";

export const toFileName = (name) => {
  if (name !== "unsaved thought") {
    return slugify(name) + ".md";
  }
  return name;
};
