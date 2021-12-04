const fs = require("fs");
const path = require("path");
const { toFormattedFile, parseFrontmatter } = require("./parser");

// rename image directories to use the file's id, not its name
// i.e. convert images/growing-kale/TlObiRHwUT.webp
// to images/80716188/TlObiRHwUT.webp
const addIds = () => {
  const location = path.join(__dirname, "../..", "wm");
  fs.readdir(location, (err, files) => {
    for (const file of files) {
      if (file.indexOf(".md") !== -1) {
        const fileLoc = path.join(__dirname, "../..", "wm", file);

        fs.readFile(fileLoc, (err, data) => {
          const parsed = parseFrontmatter(data.toString());
          const nameToReplace = file.replace(".md", "");
          // assuming here the only instances the id shows up are in the img paths
          parsed.content = parsed.content.replaceAll(
            nameToReplace,
            parsed.data.id
          );
          const res = toFormattedFile(parsed.content, parsed.data);
          fs.writeFile(fileLoc, res, (err) => {
            if (err) console.log(err);
          });

          // rename the image directory
        });
      }
    }
  });
};

addIds();
