const express = require("express");
const app = express();
const port = 3000;

const { getFile, getAllFiles } = require("./utils/filesystem");

app.get("/thought/:id", async (req, res) => {
  const content = await getFile(req.params.id + ".md");
  res.json(content);
});

app.get("/", async (req, res) => {
  const files = await getAllFiles();
  res.json(files);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
