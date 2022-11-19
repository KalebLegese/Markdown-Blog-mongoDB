const express = require("express");
const mongoose = require("mongoose");
const articlesRouter = require("./routes/articles");
const Article = require("./models/articles");
const methotdOverride = require("method-override");
const app = express();

const url =
  "mongodb+srv://kaleb:kaleb1@cluster0.7i69bsl.mongodb.net/rich-grow?retryWrites=true&w=majority";

mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((result) => {
    console.log("DB CONNECTED on listing");
  })
  .catch((err) => console.log(err));

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: false }));
app.use(methotdOverride("_method"));

app.use("/articles", articlesRouter);

app.get("/", async (req, res) => {
  const articles = await Article.find().sort({
    createdAt: "desc",
  });
  res.render("articles/index", { articles: articles });
});

app.listen(process.env.PORT || 5000);
