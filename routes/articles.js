const express = require("express");
const Article = require("../models/articles");

const routes = express.Router();

routes.get("/new", (req, res) => {
  res.render("articles/new", { article: new Article() });
});

routes.get("/:slug", async (req, res) => {
  const article = await Article.findOne({ slug: req.params.slug });
  console.log(article);
  if (article == null) {
    res.redirect("/");
  }
  res.render("articles/show", { article: article });
});

routes.get("/edit/:id", async (req, res) => {
  const article = await Article.findById(req.params.id);
  res.render("articles/edit", { article: article });
});

routes.post(
  "/",
  async (req, res, next) => {
    req.article = new Article();
    next();
  },
  saveArticleAndRedirect("new")
);

routes.put(
  "/:id",
  async (req, res, next) => {
    req.article = await Article.findById(req.params.id);
    next();
  },
  saveArticleAndRedirect("new")
);

routes.delete("/:id", async (req, res) => {
  await Article.findByIdAndDelete(req.params.id);
  res.redirect("/");
});

function saveArticleAndRedirect(path) {
  return async (req, res) => {
    let article = req.article;
    article.title = req.body.title;
    article.description = req.body.description;
    article.markdown = req.body.markdown;

    try {
      article = await article.save();
      res.redirect(`/articles/${article.slug}`);
    } catch (e) {
      console.log(e);
      res.render(`articles/${path}`, { article: article });
    }
  };
}
module.exports = routes;
