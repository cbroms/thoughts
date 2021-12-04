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
            `images/${nameToReplace}/`,
            `images/${parsed.data.id}/`
          );
          const res = toFormattedFile(parsed.content, parsed.data);
          fs.writeFile(fileLoc, res, (err) => {
            if (err) console.log(err);
          });

          const oldDir = path.join(
            __dirname,
            "../..",
            "wm",
            "images",
            nameToReplace
          );
          const newDir = path.join(
            __dirname,
            "../..",
            "wm",
            "images",
            parsed.data.id
          );
          // rename the image directory
          try {
            fs.renameSync(oldDir, newDir);
            console.log(
              `Renamed images/${nameToReplace} to images/${parsed.data.id} `
            );
          } catch (err) {
            // console.log(err);
          }
        });
      }
    }
  });
};

addIds();
