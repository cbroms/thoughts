const fs = require("fs");
const path = require("path");
const util = require("util");
const { exec } = require("child_process");

const read = util.promisify(fs.readFile);
const readDir = util.promisify(fs.readdir);
const write = util.promisify(fs.writeFile);
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
      reject(404);
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
      reject(404);
    }
  });
};

const getFileRaw = async (filename) => {
  return new Promise(async (resolve, reject) => {
    try {
      const location = path.join(__dirname, "../..", dir, filename);
      console.log(location);
      const file = await read(location, "utf8");
      // just return the markdown and title minus the frontmatter
      const parsed = parseFrontmatter(file);
      console.log(parsed.content);
      const res = { content: parsed.content, title: parsed.data.node };
      resolve(res);
    } catch (err) {
      reject(404);
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
      reject(404);
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
      // extract out all the links to files (these include .md), removing duplicates and non-internal links
      const forwardlinks = [
        ...new Set(
          [...content.content.matchAll(/(?<=\[.*\]\()([^\)]*)(?=\))/gm)].map(
            (l) => l[0]
          )
        ),
      ].filter((l) => l.indexOf(".md") !== -1);

      const cleanedForwardlinks = forwardlinks.map((l) => l.replace(".md", ""));

      // helper function to iterate over the forward links and update all the files to include
      // the new file as one of the backlinks
      const updateConnectedFilesBacklinks = async () => {
        const newId = filename.replace(".md", "");

        // iterate over the forward links, open the files, and add the new file to the backlinks
        for (const linkFilename of forwardlinks) {
          try {
            const location = path.join(__dirname, "../..", dir, linkFilename);
            const file = await read(location, "utf8");
            const parsed = parseFrontmatter(file);

            console.log("UPDATED CONTENT", parsed.content);
            const updatedFileContent = toFormattedFile(parsed.content, {
              ...parsed.data,
              backlinks: [...new Set([...parsed.data.backlinks, newId])],
            });

            await write(location, updatedFileContent);
          } catch (err) {
            // ok if this fails; means there's a link to a nonexistent page
          }
        }
      };

      try {
        // if this file already exists, update it
        const location = path.join(__dirname, "../..", dir, filename);
        const file = await read(location, "utf8");
        const parsed = parseFrontmatter(file);

        // update the file with the new contents
        const newFileContent = toFormattedFile(content.content, {
          ...parsed.data,
          forwardlinks: cleanedForwardlinks,
          node: content.node,
          updated: new Date().toISOString(),
        });

        await write(location, newFileContent);
        //  update the connected files
        updateConnectedFilesBacklinks();

        resolve(200);
      } catch (err) {
        // the file doesn't exist yet; create it
        const location = path.join(__dirname, "../..", dir, filename);

        const newFileContent = toFormattedFile(content.content, {
          backlinks: [], // assuming there are no backlinks to it yet
          forwardlinks: cleanedForwardlinks,
          node: content.node,
          created: new Date().toISOString(),
          updated: null,
        });

        await write(location, newFileContent);
        updateConnectedFilesBacklinks();

        resolve(200);
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
