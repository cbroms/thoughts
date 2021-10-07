const express = require("express");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const app = express();
const port = 3000;

const {
  getFile,
  getAllFiles,
  getFileRaw,
  getFilePreview,
  getChanges,
  makeSearch,
  makeFile,
  saveImage,
} = require("./utils/filesystem");

app.use(cors());
app.use(express.json());
app.use(fileUpload({ useTempFiles: true }));

app.post("/thought/:id", (req, res, next) => {
  const id = req.params.id;
  const file = id.indexOf(".md") !== -1 ? id : id + ".md";
  makeFile(file, req.body)
    .then((content) => {
      res.json(content);
    })
    .catch(next);
});

app.post("/thought/:id/file", (req, res, next) => {
  let id = req.params.id;
  saveImage(id, req.files.file1)
    .then((content) => {
      res.json(content);
    })
    .catch(next);
});

app.get("/thought/:id/preview", (req, res, next) => {
  const id = req.params.id;
  const file = id.indexOf(".md") !== -1 ? id : id + ".md";
  getFilePreview(file)
    .then((content) => {
      res.json(content);
    })
    .catch(next);
});

app.get("/thought/:id/raw", (req, res, next) => {
  const id = req.params.id;
  const file = id.indexOf(".md") !== -1 ? id : id + ".md";
  getFileRaw(file)
    .then((content) => {
      res.json(content);
    })
    .catch(next);
});

app.get("/thought/:id", (req, res, next) => {
  const id = req.params.id;
  const file = id.indexOf(".md") !== -1 ? id : id + ".md";
  getFile(file)
    .then((content) => {
      res.json(content);
    })
    .catch(next);
});

app.get("/changes", (req, res, next) => {
  getChanges()
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
