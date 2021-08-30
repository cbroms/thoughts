import slugify from "slugify";

export const toFileName = (name) => {
  if (name !== "new thought") {
    return slugify(name).toLowerCase() + ".md";
  }
  return name;
};
