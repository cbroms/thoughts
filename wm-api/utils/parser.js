const matter = require("gray-matter");
const marked = require("marked");

const parseFrontmatter = (content) => {
  return matter(content, {
    excerpt: (file) => {
      const lines = file.content.split("\n");
      let excerpt = "";

      let i = 0;

      while (excerpt.length < 260 && i < lines.length) {
        excerpt += lines[i] + "\n";
        i++;
      }
      // TODO: extract the first image and make excerpt an object
      file.excerpt = excerpt;
    },
  });
};

const parseMarkdown = (content) => {
  return marked(content, {
    smartLists: true,
    smartypants: true,
  });
};

const parseFile = (fileContent) => {
  const parsed = { ...parseFrontmatter(fileContent) };
  parsed.content = parseMarkdown(parsed.content);
  parsed.excerpt = parseMarkdown(parsed.excerpt);
  return parsed;
};

const toFormattedFile = (content, frontmatter) => {
  const res = matter.stringify(content, frontmatter);
  if (res.indexOf("<p>") !== -1) {
    throw new Error("Attempting to save HTML!");
  }
  return res;
};

// remove file extensions
const filenamesToAddr = (files) => {
  return files.map((f) => f.replace(".md", ""));
};

module.exports = {
  parseFrontmatter,
  parseMarkdown,
  parseFile,
  filenamesToAddr,
  toFormattedFile,
};
