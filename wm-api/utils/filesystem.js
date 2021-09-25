const fs = require("fs");
const path = require("path");
const util = require("util");
const { exec } = require("child_process");
const slugify = require("slugify");

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

const { changes } = require("./changes");

const dir = "wm/";
const changesDir = dir + "changes/";

const makeChange = (type, time, node) => {
  return new Promise(async (resolve, reject) => {
    try {
      const changefile = slugify(time);
      const location = path.join(
        __dirname,
        "../..",
        changesDir,
        `${changefile}.json`
      );
      const newChange = {
        type,
        node,
        id:
          typeof node === "string"
            ? slugify(node).toLowerCase()
            : {
                from: slugify(node.from).toLowerCase(),
                to: slugify(node.to).toLowerCase(),
              },
      };
      try {
        const file = await read(location, "utf8");
        const content = JSON.parse(file);

        // does the change already exist?
        if (
          content.filter(
            (c) => c.type.action === type.action && c.node === node
          ).length > 0
        ) {
          resolve(200);
        } else {
          content.push(newChange);
          await write(location, JSON.stringify(content));
        }
      } catch {
        // the changefile doesn't exist yet
        const content = [newChange];
        await write(location, JSON.stringify(content));
      }
      resolve(200);
    } catch (err) {
      console.error(err);
      reject(500);
    }
  });
};

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
      delete res.content;
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
      const file = await read(location, "utf8");
      // just return the markdown and title minus the frontmatter
      const parsed = parseFrontmatter(file);
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
        `grep -ir "${query}" ${location}`
      );
      const lines = stdout
        .split(location)
        .filter((l) => {
          // remove any lines that have a space following the .md:
          // indicating the match comes from an element in the frontmatter
          return (
            l.length > 0 &&
            l[l.indexOf(".md:") + 4] !== " " &&
            l.indexOf("/changes/") === -1
          );
        })
        .map((l) => {
          [file, match] = l.split(".md:");

          if (match) {
            // add highlighting around the results
            const html = parseMarkdown(match).replaceAll(
              new RegExp(query, "ig"),
              (match) => {
                return `<mark>${match}</mark>`;
              }
            );
            return { file: file + ".md", match: html };
          }
        })
        .filter(
          (thing, index, self) =>
            index === self.findIndex((t) => t.file === thing.file)
        );

      resolve({ results: lines });
    } catch (err) {
      console.error(err);
      // TODO should probably differentiate the error types and handle them separately
      resolve({ results: [] });
    }
  });
};

const makeFile = async (filename, content) => {
  return new Promise(async (resolve, reject) => {
    try {
      const extractForwardLinks = (content) => {
        // extract out all the links to files (these include .md), removing duplicates and non-internal links
        const forwardlinks = [
          ...new Set(
            [...content.matchAll(/(?<=\[.*\]\()([^\)]*)(?=\))/gm)].map(
              (l) => l[0]
            )
          ),
        ].filter((l) => l.indexOf(".md") !== -1);
        return forwardlinks;
      };

      const forwardlinks = extractForwardLinks(content.content);
      const cleanedForwardlinks = forwardlinks.map((l) => l.replace(".md", ""));

      // helper function to iterate over the forward links and update all the files to include
      // the new file as one of the backlinks
      const updateConnectedFilesBacklinks = async (
        existingForwardLinks = []
      ) => {
        const newId = filename.replace(".md", "");

        const removedLinks = existingForwardLinks.filter(
          (l) => !forwardlinks.includes(l)
        );

        // iterate over the forward links, open the files, and add the new file to the backlinks
        for (const linkFilename of forwardlinks) {
          // only do the update process if the forward link is new
          if (!existingForwardLinks.includes(linkFilename)) {
            try {
              const location = path.join(__dirname, "../..", dir, linkFilename);
              const file = await read(location, "utf8");
              const parsed = parseFrontmatter(file);

              const updatedFileContent = toFormattedFile(parsed.content, {
                ...parsed.data,
                backlinks: [...new Set([...parsed.data.backlinks, newId])],
              });

              makeChange(changes.LINK, new Date().toDateString(), {
                to: parsed.data.node,
                from: content.node,
              });
              await write(location, updatedFileContent);
            } catch (err) {
              // ok if this fails; means there's a link to a nonexistent page
            }
          }
        }

        // iterate over the removed links, open the files, and remove the file from the backlinks
        for (const linkFilename of removedLinks) {
          try {
            const location = path.join(__dirname, "../..", dir, linkFilename);
            const file = await read(location, "utf8");
            const parsed = parseFrontmatter(file);

            const updatedFileContent = toFormattedFile(parsed.content, {
              ...parsed.data,
              backlinks: parsed.data.backlinks.filter((f) => f !== newId),
            });

            makeChange(changes.UNLINK, new Date().toDateString(), {
              to: parsed.data.node,
              from: content.node,
            });
            await write(location, updatedFileContent);
          } catch (err) {
            // ok if this fails; means the linked file no longer exists
          }
        }
      };

      try {
        // if this file already exists, update it
        const location = path.join(__dirname, "../..", dir, filename);
        const file = await read(location, "utf8");
        const parsed = parseFrontmatter(file);

        const existingForwardlinks = extractForwardLinks(parsed.content);

        // update the file with the new contents
        const newFileContent = toFormattedFile(content.content, {
          ...parsed.data,
          forwardlinks: cleanedForwardlinks,
          node: content.node,
          updated: new Date().toISOString(),
        });

        makeChange(changes.UPDATE, new Date().toDateString(), content.node);
        await write(location, newFileContent);
        //  update the connected files
        updateConnectedFilesBacklinks(existingForwardlinks);

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

        makeChange(changes.CREATE, new Date().toDateString(), content.node);
        await write(location, newFileContent);
        updateConnectedFilesBacklinks();

        resolve(200);
      }
    } catch (err) {
      console.error(err);
      reject(500);
    }
  });
};

const getChanges = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      const location = path.join(__dirname, "../..", changesDir);
      const files = await readDir(location);
      const res = [];

      for (const file of files) {
        const fileLocation = path.join(__dirname, "../..", changesDir, file);
        const content = await read(fileLocation, "utf8");
        const date = file.replaceAll("-", " ").replace(".json", "");
        res.push({
          date,
          id: file.replace(".json", ""),
          changes: JSON.parse(content),
        });
      }

      res.sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
      });

      resolve(res);
    } catch (err) {
      reject(404);
    }
  });
};

module.exports = {
  getFile,
  getAllFiles,
  getFileRaw,
  getFilePreview,
  getChanges,
  makeSearch,
  makeFile,
};
