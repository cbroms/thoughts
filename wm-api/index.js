const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;

const {
  getFile,
  getAllFiles,
  getFileRaw,
  getFilePreview,
  makeSearch,
  makeFile,
} = require("./utils/filesystem");

app.use(cors());
app.use(express.json());

app.post("/thought/:id", (req, res, next) => {
  const id = req.params.id;
  const file = id.indexOf(".md") !== -1 ? id : id + ".md";
  console.log(`POST page: thought/${id}`);
  makeFile(file, req.body)
    .then((content) => {
      res.json(content);
    })
    .catch(next);
});

app.get("/thought/:id/preview", (req, res, next) => {
  const id = req.params.id;
  const file = id.indexOf(".md") !== -1 ? id : id + ".md";
  console.log(`GET page preview: thought/${id}`);
  getFilePreview(file)
    .then((content) => {
      res.json(content);
    })
    .catch(next);
});

app.get("/thought/:id/raw", (req, res, next) => {
  const id = req.params.id;
  const file = id.indexOf(".md") !== -1 ? id : id + ".md";
  console.log(`GET page raw: thought/${id}`);
  getFileRaw(file)
    .then((content) => {
      res.json(content);
    })
    .catch(next);
});

app.get("/thought/:id", (req, res, next) => {
  const id = req.params.id;
  const file = id.indexOf(".md") !== -1 ? id : id + ".md";
  console.log(`GET page: thought/${id}`);
  getFile(file)
    .then((content) => {
      res.json(content);
    })
    .catch(next);
});

app.get("/", (req, res, next) => {
  console.log(`GET all pages`);
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
