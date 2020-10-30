const fs = require("fs");
const express = require("express");
const app = express();
const multer = require("multer");
const Post = require("./api/models/posts");
const postsData = new Post();

const PORT = process.env.PORT || 3000;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}${getExt(file.mimetype)}`);
  },
});

const getExt = (mimetype) => {
  switch (mimetype) {
    case "image/png":
      return ".png";
    case "image/jpeg":
      return ".jpg";
  }
};

let upload = multer({ storage: storage });

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, OPTIONS, DELETE, POST");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", true);

  next();
});

app.use(express.json());

//Express static files/folder
//Makes the photo folder available
app.use("/uploads", express.static("uploads"));

app.get("/api/posts", (req, res) => {
  res.status(200).send(postsData.get());
});

app.get("/api/posts/:postId", (req, res) => {
  const postId = req.params.postId;
  const posts = postsData.get();
  const foundPost = posts.find((post) => post.id == postId);
  if (foundPost) {
    res.status(200).send(foundPost);
  } else {
    res.status(404).send("Not Found");
  }
});

app.post("/api/posts", upload.single("post-image"), (req, res) => {
  let fileUrl = req.file.path.replace(/\\/g, "/");
  const newPost = {
    id: `${Date.now()}`,
    title: req.body.title,
    content: req.body.content,
    post_image: fileUrl,
    added_date: `${Date.now()}`,
  };
  postsData.add(newPost);
  res.status(201).send(newPost);
});

app.delete("/api/delete/:id", (req, res) => {
  var id = req.params.id;
  let arr = postsData.get();
  var index = arr.findIndex(function (o) {
    return o.id === id;
  });
  if (index !== -1) arr.splice(index, 1);
  fs.writeFileSync("data.json", JSON.stringify(arr));

  return res.status(201).end();
});

app.listen(PORT, () => console.log("listening on http://localhost:3000"));

/*
npm init
npm install --save express
npm install --save multer (For photo files handling)
npm install -g nodemon
*/
