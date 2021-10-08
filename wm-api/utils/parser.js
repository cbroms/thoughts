const matter = require("gray-matter");
const marked = require("marked");
const hljs = require("highlight.js");

const renderer = {
  image(href, title, text) {
    const hrefJpeg = href.replace(".webp", ".jpg");
    return `
            <figure>
                <picture>
                    <source srcset="/${href}" type="image/webp">
                    <source srcset="/${hrefJpeg}" type="image/jpeg"> 
                    <img src="/${hrefJpeg}" alt="${text}">
                </picture>
                <figcaption>${title}</figcaption>
            </figure> 
            `;
  },
};

marked.use({
  renderer,
  smartLists: true,
  smartypants: true,
  highlight: (code, lang) => {
    return hljs.highlight(code, { language: lang }).value;
  },
});

const parseFrontmatter = (content) => {
  return matter(content, {
    excerpt: (file) => {
      const lines = file.content.split("\n");
      let excerpt = { text: "", image: null };

      let i = 0;

      while (excerpt.text.length < 260 && i < lines.length) {
        excerpt.text += lines[i] + "\n";
        i++;
      }

      const image = file.content.match(/(?<=\()(.+.webp)/g);
      if (image && image.length > 0)
        excerpt.image = image[0].replace(".webp", ".jpg");

      file.excerpt = excerpt;
    },
  });
};

const parseMarkdown = (content) => {
  return marked(content);
};

const parseFile = (fileContent) => {
  const parsed = { ...parseFrontmatter(fileContent) };
  parsed.content = parseMarkdown(parsed.content);
  parsed.excerpt.text = parseMarkdown(parsed.excerpt.text)
    .replaceAll(/<([^>]+)>/g, "")
    .replaceAll("\n", " ")
    .trim();
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
