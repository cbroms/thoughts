const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;

const { getFile, getAllFiles, makeSearch } = require("./utils/filesystem");

app.use(cors());

app.get("/thought/:id/preview", (req, res, next) => {
  // TODO: get a more limited version of the page's data
  getFile(req.params.id + ".md")
    .then((content) => {
      res.json(content);
    })
    .catch(next);
});

app.get("/thought/:id", (req, res, next) => {
  getFile(req.params.id + ".md")
    .then((content) => {
      res.json(content);
    })
    .catch(next);
});

app.get("/", (req, res, next) => {
  getAllFiles()
    .then((files) => {
      res.json(files);
    })
    .catch(next);
});

app.get("/search/:query", (req, res, next) => {
  makeSearch(req.params.query)
    .then((results) => {
      res.json(results);
    })
    .catch(next);
});

app.listen(port, () => {
  console.log(`wm-api running at http://localhost:${port}`);
});
