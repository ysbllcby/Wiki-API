const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

// TODO
// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/wikiDB", { useNewURLParser: true });

// Create a Schema
const articleSchema = {
  title: String,
  content: String,
};

// Create a Model
const Article = mongoose.model("Article", articleSchema);

app.get("/articles", function (req, res) {
  Article.find().then(function (err, foundArticles) {
    if (!err) {
      res.send(foundArticles);
    } else {
      res.send(err);
    }
  });
});

app.post("/articles", function (req, res) {
  const newArticle = new Article({
    title: req.query.title,
    content: req.query.content,
  });
  newArticle.save();
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
