const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();

app.set("view engine", 'ejs');
app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB",{ useNewUrlParser: true, useUnifiedTopology: true });

const articleSchema = {
  title : String,
  content : String
}
const Article = mongoose.model("Article", articleSchema);

//////////////////////////// Request Targeting All Articles /////////////////////
app.route("/articles")
.get(function(req,res){
  Article.find({ },function(err,foundArticles){
    if(!err){
      res.send(foundArticles);
    } else{
      res.send(err);
    }

  });
})
.post(function(req,res){
  const title = req.body.title;
  const content = req.body.content;
  const newArticle = new Article({
    title : title,
    content : content
  });
  newArticle.save(function(err){
    if(!err){
      res.send("Successfully added a new article.");
    }else{
      res.send(err);
    }
  });
})
.delete(function(req,res){
  Article.deleteMany({ },function(err){
    if(!err){
      res.send("Successfully deleted all the articles");
    }else{
      res.send(err);
    }
  })
});

///////////////////////// Request Targeting specific Articles///////////////////

app.route("/articles/:articleTitle")
.get(function(req,res){
  const requestedTitle = req.params.articleTitle;
  Article.findOne({title : requestedTitle},function(err,foundArticle){
    if(foundArticle){
      res.send(foundArticle);
    }else{
      res.send("No article matching the title was found");
    }
  });
})
.put(function(req,res){
  const requestedTitle = req.params.articleTitle;
  Article.update(
    {title : requestedTitle},
    {title : req.body.title,
    content : req.body.content},
    {overwrite : true},
    function(err){
      if(!err){
        res.send("Successfully updated article");
      }
    }
   )
})
.patch(function(req,res){
  const requestedTitle = req.params.articleTitle;
  Article.update(
    {title : requestedTitle},
    {$set : req.body},
    function(err){
      if(!err){
        res.send("Successfully updated")
      }else{
        res.send(err);
      }
    }
  )
})
.delete(function(req,res){
  const requestedTitle = req.params.articleTitle;
  Article.deleteOne({title : requestedTitle},function(err){
    if(!err){
      res.send("Successfully deleted specific article")
    }else{
      res.send(err);
    }
  })
});

app.listen(3000,function(){
  console.log("Server has started at port 3000");
})
