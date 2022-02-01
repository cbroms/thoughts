const fs = require("fs");
const path = require("path");
const { parseFrontmatter, toFormattedFile } = require("../parser");

const makeDirectories = () => {
  const location = path.join(__dirname, "../../..", "wm");
  fs.readdir(location, (err, files) => {
    for (const file of files) {
      if (file.indexOf(".md") !== -1) {
        try {
          const dirName = file.replace(".md", "");

          const dirLoc = path.join(__dirname, "../../..", "wm", dirName);

          fs.mkdir(dirLoc, null, (err) => {
            if (!err) {
              const fileLoc = path.join(__dirname, "../../..", "wm", file);
              // open the og file to read its content
              fs.readFile(fileLoc, (err, data) => {
                const file = parseFrontmatter(data.toString());

                const ogCreated = file.data.created.split("T")[0];
                const ogUpdated = file.data.updated.split("T")[0];
                const updates =
                  ogCreated !== ogUpdated
                    ? [ogCreated, ogUpdated]
                    : [ogCreated];
                const places =
                  ogCreated !== ogUpdated
                    ? [file.data.place, file.data.place]
                    : [file.data.place];

                // create a new file with the updated frontmatter
                const newFile = toFormattedFile(file.content, {
                  id: file.data.id,
                  node: file.data.node,
                  backlinks: file.data.backlinks,
                  forwardlinks: file.data.forwardlinks,
                  updates,
                  places,
                });

                // write the file with the new content
                fs.writeFile(fileLoc, newFile, (err) => {
                  console.log(err);
                });

                // make a copy of the file in the history dir with its created date as the filename
                // name the new file the created date
                const createdName = ogCreated + ".md";
                const createdFileLoc = path.join(
                  __dirname,
                  "../../..",
                  "wm",
                  dirName,
                  createdName
                );
                // write it with the new file content
                fs.writeFile(createdFileLoc, newFile, (err) => {
                  console.log(err);
                });

                // now do the same process with the last updated date if its different than the created date
                if (ogCreated !== ogUpdated) {
                  const updatedName = ogUpdated + ".md";
                  const updatedFileLoc = path.join(
                    __dirname,
                    "../../..",
                    "wm",
                    dirName,
                    updatedName
                  );
                  fs.writeFile(updatedFileLoc, newFile, (err) => {
                    console.log(err);
                  });
                }
              });
            }
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
