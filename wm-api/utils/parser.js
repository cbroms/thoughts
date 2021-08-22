const matter = require("gray-matter");
const marked = require("marked");

const parseFrontmatter = (content) => {
  return matter(content);
};

const parseMarkdown = (content) => {
  return marked(content);
};

const parseFile = (fileContent) => {
  const parsed = parseFrontmatter(fileContent);
  parsed.content = parseMarkdown(parsed.content);
  return parsed;
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
};
