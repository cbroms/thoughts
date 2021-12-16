const fs = require("fs");
const path = require("path");
const util = require("util");
const { exec } = require("child_process");
const slugify = require("slugify");
const sharp = require("sharp");
const { customAlphabet } = require("nanoid");

const nanoid = customAlphabet(
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefhijklmnopqrstuvwxyz",
  10
);

const thoughtId = customAlphabet("0123456789", 8);

const read = util.promisify(fs.readFile);
const readDir = util.promisify(fs.readdir);
const write = util.promisify(fs.writeFile);
const rename = util.promisify(fs.rename);
const execute = util.promisify(exec);

const {
  parseFile,
  toFilename,
  filenamesToAddr,
  parseMarkdown,
  parseFrontmatter,
  toFormattedFile,
} = require("./parser");

const { changes } = require("./changes");

const dir = "wm/";
const changesDir = "changes/";
const imagesDir = "images/";
const indexDir = "indexed/";

const updateFrontmatter = (filename, field, value) => {
  return new Promise(async (resolve, reject) => {
    try {
      filename = toFilename(filename);
      const location = path.join(__dirname, "../..", dir, filename);
      const file = await read(location, "utf8");
      const parsed = parseFrontmatter(file);

      const newFileContent = toFormattedFile(parsed.content, {
        ...parsed.data,
        [field]: value,
      });

      // makeChange(change, new Date().toDateString(), parsed.data.node);
      await write(location, newFileContent);
      resolve(200);
    } catch (err) {
      console.error(err);
      reject(500);
    }
  });
};

const modifyIndex = (node, addToIndex) => {
  return new Promise(async (resolve, reject) => {
    try {
      const location = path.join(
        __dirname,
        "../..",
        dir + indexDir,
        `indexed.json`
      );
      try {
        const file = await read(location, "utf8");
        let content = JSON.parse(file);

        if (addToIndex) {
          if (content.indexOf(node) === -1) {
            // add the node to the index
            content.push(node);
            await write(location, JSON.stringify(content));
            // add indexed to the node's frontmatter
            await updateFrontmatter(node, "indexed", true);
          }
          resolve({ indexed: true });
        } else {
          // remove the node from the index
          if (content.indexOf(node) !== -1) {
            content = content.filter((n) => {
              return n !== node;
            });

            await write(location, JSON.stringify(content));
            await updateFrontmatter(node, "indexed", false);
          }
          resolve({ indexed: false });
        }
      } catch (err) {
        // the index file doesn't exist yet
        if (addToIndex) {
          const content = [node];
          await write(location, JSON.stringify(content));
          await updateFrontmatter(node, "indexed", true);
          resolve({ indexed: true });
        } else {
          resolve({ indexed: false });
        }
      }
    } catch (err) {
      console.error(err);
      reject(500);
    }
  });
};

const makeChange = (type, time, node) => {
  return new Promise(async (resolve, reject) => {
    try {
      const changefile = slugify(time);
      const location = path.join(
        __dirname,
        "../..",
        dir + changesDir,
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
      console.error(err);
      reject(404);
    }
  });
};

const getCounts = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      const location = path.join(
        __dirname,
        "../..",
        dir,
        "counts/current.json"
      );
      const file = await read(location, "utf8");
      resolve(JSON.parse(file));
    } catch (err) {
      console.error(err);
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
      const res = {
        content: parsed.content,
        title: parsed.data.node,
        indexed: parsed.data.indexed || false,
      };
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
        `grep -ir --exclude-dir={images,indexed,changes} "${query}" ${location}`
      );
      const lines = stdout
        .split(location)
        .filter((l) => {
          // remove any lines that have a space following the .md:
          // indicating the match comes from an element in the frontmatter
          return (
            l.length > 0 &&
            l[l.indexOf(".md:") + 4] !== " " &&
            l.indexOf("/changes/") === -1 &&
            l.indexOf("/indexed/") === -1 &&
            l.indexOf("/images/") === -1
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
          return { file: file + ".md", match };
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
          id: thoughtId(),
          place: process.env.PLACE || "",
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

const renameFile = (oldId, newNode, newId, content) => {
  return new Promise(async (resolve, reject) => {
    try {
      const oldFilename = toFilename(oldId);
      const newFilename = toFilename(newId);

      // standard save the file
      if (content) await makeFile(oldFilename, content);

      const newLocation = path.join(__dirname, "../..", dir, newFilename);
      const oldLocation = path.join(__dirname, "../..", dir, oldFilename);

      const file = await read(oldLocation, "utf8");
      const parsed = parseFrontmatter(file);

      // replace node with newNode
      await updateFrontmatter(oldFilename, "node", newNode);

      // rename the file
      await rename(oldLocation, newLocation);

      // open each forwardlink and replace old id in page's backlinks to new id
      for (const forwardLink of parsed.data.forwardlinks) {
        const forwardLoc = path.join(
          __dirname,
          "../..",
          dir,
          toFilename(forwardLink)
        );
        const forwardFile = await read(forwardLoc, "utf8");
        const forwardParsed = parseFrontmatter(forwardFile);

        // replace the old id with the new id
        forwardParsed.data.backlinks = forwardParsed.data.backlinks.map((l) => {
          return l === oldId ? newId : l;
        });

        const newFileContent = toFormattedFile(
          forwardParsed.content,
          forwardParsed.data
        );
        await write(forwardLoc, newFileContent);
      }

      // open each backlink and:
      // 1. replace old id in page's forwardlinks to new id
      // 2. replace instances of old id in page's body with new id
      for (const backlink of parsed.data.backlinks) {
        const backLoc = path.join(
          __dirname,
          "../..",
          dir,
          toFilename(backlink)
        );
        const backFile = await read(backLoc, "utf8");
        const backParsed = parseFrontmatter(backFile);

        // replace the old id with the new id
        backParsed.data.forwardlinks = backParsed.data.forwardlinks.map((l) => {
          return l === oldId ? newId : l;
        });

        // replace all instances of the old id in the linking page
        backParsed.content = backParsed.content.replaceAll(oldId, newId);

        const newFileContent = toFormattedFile(
          backParsed.content,
          backParsed.data
        );
        await write(backLoc, newFileContent);
      }

      resolve({ node: newNode, id: newId, content });
    } catch (e) {
      console.error(e);
      reject(500);
    }
  });
};

const getChanges = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      const location = path.join(__dirname, "../..", dir + changesDir);
      const files = await readDir(location);
      const res = [];

      for (const file of files) {
        const fileLocation = path.join(
          __dirname,
          "../..",
          dir + changesDir,
          file
        );
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

const getIndexed = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const location = path.join(
        __dirname,
        "../..",
        dir + indexDir,
        `indexed.json`
      );
      const file = await read(location, "utf8");
      const content = JSON.parse(file);
      resolve(content);
    } catch (err) {
      console.error(err);
      reject(500);
    }
  });
};

const saveImage = (filename, file) => {
  return new Promise(async (resolve, reject) => {
    try {
      // open the parent file and get its id
      // TODO: technically this should be wrapped and send a 404 if the parent file doesn't exist
      const parentLoc = path.join(__dirname, "../..", dir, filename);
      const parentFile = await read(parentLoc, "utf8");
      const parsed = parseFrontmatter(parentFile);

      const id = parsed.data.id;

      const location = path.join(__dirname, "../..", dir + imagesDir, id);
      if (!fs.existsSync(location)) {
        fs.mkdirSync(location);
      }

      const imageId = nanoid();

      const ogFile = sharp(file.tempFilePath);

      await ogFile
        .rotate()
        .webp({ quality: 75 })
        .toFile(`${location}/${imageId}.webp`);

      await ogFile
        .rotate()
        .jpeg({ quality: 75 })
        .toFile(`${location}/${imageId}.jpg`);

      // delete the temporary file
      fs.unlinkSync(file.tempFilePath);

      resolve({ image: `${imagesDir}${id}/${imageId}.webp` });
    } catch (e) {
      console.error(e);
      reject(500);
    }
  });
};

module.exports = {
  getCounts,
  getFile,
  getAllFiles,
  getFileRaw,
  getFilePreview,
  getChanges,
  makeSearch,
  makeFile,
  saveImage,
  renameFile,
  modifyIndex,
  getIndexed,
};
