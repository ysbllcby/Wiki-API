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

// Getting all articles
app
  .route("/articles")
  .get(function (req, res) {
    Article.find().then(function (err, foundArticles) {
      if (!err) {
        res.send(foundArticles);
      } else {
        res.send(err);
      }
    });
  })
  .post(function (req, res) {
    const newArticle = new Article({
      title: req.query.title,
      content: req.query.content,
    });
    newArticle.save();
  })
  .delete(function (req, res) {
    Article.deleteMany().then(function (err) {
      if (!err) {
        res.send("Successfully deleted all articles.");
      } else {
        res.send(err);
      }
    });
  });

// Getting a specific article
app
  .route("/articles/:articleTitle")
  .get(function (req, res) {
    Article.findOne({ title: req.params.articleTitle }).then(function (
      foundArticle
    ) {
      if (foundArticle) {
        res.send(foundArticle);
      } else {
        res.send("No articles matching that title was found.");
      }
    });
  })
  .put(function (req, res) {
    Article.findOneAndUpdate(
      { title: req.params.articleTitle },
      { title: req.body.title, content: req.body.content },
      { overwrite: true }
    ).then(function (err) {
      if (!err) {
        res.send("Successfully updated article.");
      }
    });
  })
  .patch(function (req, res) {
    modifyOne();
    async function modifyOne() {
      try {
        await Article.updateOne(
          { title: req.params.articleTitle },
          { $set: req.body }
        ).then(res.send("Successfully updated article"));
      } catch (err) {
        console.log(err);
      }
    }
  })
  .delete(function (req, res) {
    Article.deleteOne({ title: req.params.articleTitle }).then(function (err) {
      if (!err) {
        res.send("Successfully deleted article.");
      } else {
        res.send(err);
      }
    });
  });

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
