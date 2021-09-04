const matter = require("gray-matter");
const marked = require("marked");

const parseFrontmatter = (content) => {
  return matter(content);
};

const parseMarkdown = (content) => {
  return marked(content, { smartLists: true, smartypants: true });
};

const parseFile = (fileContent) => {
  const parsed = parseFrontmatter(fileContent);
  parsed.content = parseMarkdown(parsed.content);
  return parsed;
};

const toFormattedFile = (
  backlinks,
  forwardlinks,
  node,
  content,
  created,
  updated
) => {
  return matter.stringify(content, {
    node: node,
    backlinks,
    forwardlinks,
    created,
    updated,
  });
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
