const fs = require("fs");
const path = require("path");
const util = require("util");
const { exec } = require("child_process");

const read = util.promisify(fs.readFile);
const readDir = util.promisify(fs.readdir);
const execute = util.promisify(exec);

const {
  parseFile,
  filenamesToAddr,
  parseMarkdown,
  parseFrontmatter,
  toFormattedFile,
} = require("./parser");

const dir = "wm/";

const getFile = async (filename) => {
  return new Promise(async (resolve, reject) => {
    try {
      const location = path.join(__dirname, "../..", dir, filename);
      const file = await read(location, "utf8");
      const res = parseFile(file);
      resolve(res);
    } catch (err) {
      reject(500);
    }
  });
};

const getFilePreview = async (filename) => {
  return new Promise(async (resolve, reject) => {
    try {
      const location = path.join(__dirname, "../..", dir, filename);
      const file = await read(location, "utf8");
      const res = parseFile(file);
      resolve(res);
    } catch (err) {
      reject(500);
    }
  });
};

const getFileRaw = async (filename) => {
  return new Promise(async (resolve, reject) => {
    try {
      const location = path.join(__dirname, "../..", dir, filename);
      const file = await read(location, "utf8");
      // just return the markdown and title minus the frontmatter
      const parsed = parseFrontmatter(file);
      const res = { content: parsed.content, title: parsed.data.node };
      resolve(res);
    } catch (err) {
      reject(500);
    }
  });
};

const getAllFiles = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      const location = path.join(__dirname, "../..", dir);
      const files = await readDir(location);
      const res = filenamesToAddr(files);
      resolve(res);
    } catch (err) {
      reject(500);
    }
  });
};

const makeSearch = async (query) => {
  return new Promise(async (resolve, reject) => {
    try {
      const location = path.join(__dirname, "../..", dir);
      const { stdout, stderr } = await execute(
        `grep -r "${query}" ${location}`
      );
      const lines = stdout
        .split(location)
        .filter((l) => {
          // remove any lines that have a space following the .md:
          // indicating the match comes from an element in the frontmatter
          return l.length > 0 && l[l.indexOf(".md:") + 4] !== " ";
        })
        .map((l) => {
          [file, match] = l.split(".md:");

          // add highlighting around the results
          const html = parseMarkdown(match).replaceAll(
            new RegExp(query, "ig"),
            (match) => {
              return `<mark>${match}</mark>`;
            }
          );
          return { file: file + ".md", match: html };
        });

      resolve({ results: lines });
    } catch (err) {
      // TODO should probably differentiate the error types and handle them separately
      resolve({ results: [] });
    }
  });
};

const makeFile = async (filename, content) => {
  return new Promise(async (resolve, reject) => {
    try {
      // extract out all the links to files (these include .md)
      const forwardlinks = [
        ...content.content.matchAll(/(?<=\[.*\]\()([^\)]*)(?=\))/gm),
      ];

      console.log(forwardlinks);
      const cleanedForwardlinks = forwardlinks.map((l) =>
        l[0].replace(".md", "")
      );

      try {
        // try seeing if the file already exists
        const location = path.join(__dirname, "../..", dir, filename);
        const file = await read(location, "utf8");
        const parsed = parseFrontmatter(file);

        // works!
        const res = toFormattedFile(
          parsed.data.backlinks,
          cleanedForwardlinks,
          content.node,
          content.content
        );

        // TODO iterate over the forward links, open the files, and add the new file to the backlinks
        resolve(res);
      } catch {
        // the file doesn't exist yet; create it
        // making the assumption there are no backlinks to it yet
      }
    } catch (err) {
      console.log(err);
      reject(500);
    }
  });
};

module.exports = {
  getFile,
  getAllFiles,
  getFileRaw,
  getFilePreview,
  makeSearch,
  makeFile,
};
