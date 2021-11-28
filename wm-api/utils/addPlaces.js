const fs = require("fs");
const path = require("path");
const { toFormattedFile, parseFrontmatter } = require("./parser");

// add unique ids to all thoughts
const addIds = () => {
  const location = path.join(__dirname, "../..", "wm");
  fs.readdir(location, (err, files) => {
    for (const file of files) {
      if (file.indexOf(".md") !== -1) {
        const fileLoc = path.join(__dirname, "../..", "wm", file);

        fs.readFile(fileLoc, (err, data) => {
          const file = parseFrontmatter(data.toString());
          const res = toFormattedFile(file.content, {
            ...file.data,
            place: "Berkeley, CA",
          });
          fs.writeFile(fileLoc, res, (err) => {
            if (err) console.log(err);
          });
        });
      }
    }
  });
};

addIds();
