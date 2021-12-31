const { customAlphabet } = require("nanoid");
const fs = require("fs");
const path = require("path");
const { toFormattedFile, parseFrontmatter } = require("../parser");

const nanoid = customAlphabet("0123456789", 8);

// add unique ids to all thoughts
const addIds = () => {
  const location = path.join(__dirname, "../../..", "wm");
  fs.readdir(location, (err, files) => {
    for (const file of files) {
      if (file.indexOf(".md") !== -1) {
        const fileLoc = path.join(__dirname, "../../..", "wm", file);

        fs.readFile(fileLoc, (err, data) => {
          const file = parseFrontmatter(data.toString());
          const res = toFormattedFile(file.content, {
            ...file.data,
            id: nanoid(),
          });
          fs.writeFile(fileLoc, res, (err) => {
            console.log(err);
          });
        });
      }
    }
  });
};

addIds();
