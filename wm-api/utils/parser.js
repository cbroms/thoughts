const matter = require("gray-matter");
const marked = require("marked");
const hljs = require("highlight.js");

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
    highlight: (code, lang) => {
      return hljs.highlight(code, { language: lang }).value;
    },
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
  return res;
};

// remove file extensions
const filenamesToAddr = (files) => {
  // only .md files
  return files
    .filter((f) => f.indexOf(".md") !== -1)
    .map((f) => f.replace(".md", ""));
};

module.exports = {
  parseFrontmatter,
  parseMarkdown,
  parseFile,
  filenamesToAddr,
  toFormattedFile,
};
