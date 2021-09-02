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

module.exports = {
  getFile,
  getAllFiles,
  getFileRaw,
  getFilePreview,
  makeSearch,
};
