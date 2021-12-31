const fs = require("fs");
const path = require("path");
const util = require("util");
const readDir = util.promisify(fs.readdir);
const sharp = require("sharp");

// non-distructively reduce the size of all the images in wm/images and save
// the resized versions to wm/new_images
const reduceImageSizes = () => {
  return new Promise(async (resolve, reject) => {
    const imagesDirLoc = path.join(__dirname, "../../..", "wm", "/images");
    const dirsInDirLoc = await readDir(imagesDirLoc);
    const dirs = dirsInDirLoc.filter((i) => i.indexOf(".DS_Store") === -1);

    for (const subdir of dirs) {
      const location = path.join(imagesDirLoc, subdir);
      const filesInDir = await readDir(location);
      const imgs = filesInDir.filter((i) => i.indexOf(".DS_Store") === -1);

      for (const img of imgs) {
        console.log("saving ", img);

        const imageLoc = path.join(location, img);
        const newLoc = path.join(
          __dirname,
          "../../..",
          "wm",
          "/new_images/",
          subdir
        );
        if (!fs.existsSync(newLoc)) {
          fs.mkdirSync(newLoc);
        }

        const ogFile = sharp(imageLoc);

        if (img.indexOf(".webp") !== -1) {
          await ogFile
            .rotate()
            .resize(900, 900, {
              fit: sharp.fit.inside,
              withoutEnlargement: true,
            })
            .webp({ quality: 75 })
            .toFile(`${newLoc}/${img}`);
        } else {
          await ogFile
            .rotate()
            .resize(900, 900, {
              fit: sharp.fit.inside,
              withoutEnlargement: true,
            })
            .jpeg({ quality: 75 })
            .toFile(`${newLoc}/${img}`);
        }
      }
    }
  });
};

reduceImageSizes()
  .then((s) => {
    console.log(s);
  })
  .catch((e) => {
    console.error(e);
  })
  .finally(() => {
    console.log("done");
  });
