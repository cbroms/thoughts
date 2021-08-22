const fs = require("fs");
const path = require("path");
const util = require("util");

const read = util.promisify(fs.readFile);
const readDir = util.promisify(fs.readdir);

const { parseFile, filenamesToAddr } = require("./parser");

const dir = "wm/";

const getFile = async (filename) => {
  const location = path.join(__dirname, "../..", dir, filename);
  const res = await read(location, "utf8");
  return parseFile(res);
};

const getAllFiles = async () => {
  const location = path.join(__dirname, "../..", dir);
  const res = await readDir(location);
  return filenamesToAddr(res);
};

module.exports = { getFile, getAllFiles };
