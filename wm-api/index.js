const express = require("express");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const app = express();
const port = 3000;

const { toFilename, fromFilename } = require("./utils/parser");

const {
  getCounts,
  getFile,
  getAllFiles,
  getFileRaw,
  getFilePreview,
  getChanges,
  makeSearch,
  makeFile,
  saveImage,
  modifyIndex,
  modifyDaily,
  renameFile,
  getIndexed,
  getDaily,
} = require("./utils/filesystem");

app.use(cors());
app.use(express.json());
app.use(fileUpload({ useTempFiles: true }));

app.post("/thought/:id", (req, res, next) => {
  const id = req.params.id;
  const file = toFilename(id);
  makeFile(file, req.body)
    .then((content) => {
      res.json(content);
    })
    .catch(next);
});

app.post("/thought/:id/index", (req, res, next) => {
  const id = req.params.id;
  const node = fromFilename(id);

  modifyIndex(node, req.body.index)
    .then((content) => {
      res.json(content);
    })
    .catch(next);
});

app.post("/thought/:id/daily", (req, res, next) => {
  const id = req.params.id;
  const node = fromFilename(id);

  modifyDaily(node, req.body.daily)
    .then((content) => {
      res.json(content);
    })
    .catch(next);
});

app.post("/thought/:id/rename", (req, res, next) => {
  const id = req.params.id;
  const node = fromFilename(id);
  renameFile(node, req.body.node, req.body.id, req.body.content)
    .then((content) => {
      res.json(content);
    })
    .catch(next);
});

app.post("/thought/:id/file", (req, res, next) => {
  let id = req.params.id;
  const filename = toFilename(id);
  saveImage(filename, req.files.file1)
    .then((content) => {
      res.json(content);
    })
    .catch(next);
});

app.get("/thought/:id/preview", (req, res, next) => {
  const id = req.params.id;
  const file = toFilename(id);
  getFilePreview(file)
    .then((content) => {
      res.json(content);
    })
    .catch(next);
});

app.get("/thought/:id/raw", (req, res, next) => {
  const id = req.params.id;
  const file = toFilename(id);
  getFileRaw(file)
    .then((content) => {
      res.json(content);
    })
    .catch(next);
});

app.get("/thought/:id", (req, res, next) => {
  const id = req.params.id;
  const file = toFilename(id);
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

app.get("/indexed", (req, res, next) => {
  getIndexed()
    .then((content) => {
      res.json(content);
    })
    .catch(next);
});

app.get("/daily", (req, res, next) => {
  getDaily()
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

app.get("/counts", (req, res, next) => {
  getCounts()
    .then((count) => {
      res.json(count);
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
  console.log("setting place of new thoughts to " + process.env.PLACE);
  console.log(`wm-api running at http://localhost:${port}`);
});
