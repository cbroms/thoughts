const fs = require("fs");
const path = require("path");
const { parseFrontmatter, toFormattedFile } = require("../parser");

const makeDirectories = () => {
  const location = path.join(__dirname, "../../..", "wm");
  fs.readdir(location, (err, files) => {
    for (const file of files) {
      if (file.indexOf(".md") !== -1) {
        try {
          console.log(file);
          const fileLoc = path.join(__dirname, "../../..", "wm", file);

          fs.readFile(fileLoc, (err, data) => {
            // open the og file to read its content
            const oldFile = parseFrontmatter(data.toString());

            // create a new dir from the node's id
            const dirName = oldFile.data.id;
            const dirLoc = path.join(
              __dirname,
              "../../..",
              "wm/history",
              dirName
            );

            fs.mkdir(dirLoc, null, (err) => {
              if (!err) {
                const ogCreated = oldFile.data.created.split("T")[0];
                const ogUpdated = oldFile.data.updated?.split("T")[0] || null;
                const updates =
                  ogCreated !== ogUpdated
                    ? [ogCreated, ogUpdated]
                    : [ogCreated];
                const places =
                  ogCreated !== ogUpdated
                    ? [oldFile.data.place, oldFile.data.place]
                    : [oldFile.data.place];

                // create a new file with the updated frontmatter
                const newFileFull = toFormattedFile(oldFile.content, {
                  id: oldFile.data.id,
                  node: oldFile.data.node,
                  indexed: oldFile.data.indexed || false,
                  daily: oldFile.data.daily || false,
                  backlinks: oldFile.data.backlinks,
                  forwardlinks: oldFile.data.forwardlinks,
                  updates,
                  places,
                });

                // write the file with the new content
                fs.writeFile(fileLoc, newFileFull, (err) => {
                  console.log(err);
                });

                // make a copy of the file in the history dir with its created date as the filename
                // name the new file the created date
                const createdName = ogCreated + ".md";
                const createdFileLoc = path.join(
                  __dirname,
                  "../../..",
                  "wm/history",
                  dirName,
                  createdName
                );

                // for this file we only want the first update / place
                const newFilePartial = toFormattedFile(oldFile.content, {
                  id: oldFile.data.id,
                  node: oldFile.data.node,
                  indexed: oldFile.data.indexed || false,
                  daily: oldFile.data.daily || false,
                  backlinks: oldFile.data.backlinks,
                  forwardlinks: oldFile.data.forwardlinks,
                  updates: [ogCreated],
                  places: [oldFile.data.place],
                });

                // write it with the new file content
                fs.writeFile(createdFileLoc, newFilePartial, (err) => {
                  console.log(err);
                });

                // now do the same process with the last updated date if its different than the created date
                if (ogCreated !== ogUpdated) {
                  const updatedName = ogUpdated + ".md";
                  const updatedFileLoc = path.join(
                    __dirname,
                    "../../..",
                    "wm/history",
                    dirName,
                    updatedName
                  );
                  // for this file we can use the full file
                  fs.writeFile(updatedFileLoc, newFileFull, (err) => {
                    console.log(err);
                  });
                }
              }
            });
          });
        } catch (err) {
          console.error(err);
          console.log(`skipping ${file} - error`);
        }
      }
    }
  });
};

makeDirectories();
