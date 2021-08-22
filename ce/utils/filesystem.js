const fs = require("fs");
const path = require("path");
const util = require("util");

const read = util.promisify(fs.readFile);
const { parseFile } = require("./parser");

const dir = "stm/";

const getFile = async (filename) => {
  const location = path.join(__dirname, "../..", dir, filename);
  const res = await read(location, "utf8");
  return parseFile(res);
};

module.exports = { getFile };
