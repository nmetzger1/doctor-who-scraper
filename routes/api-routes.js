//Packages
var request = require("request");
var cheerio = require("cheerio");

//Database Models
var Article = require("../models/articles.js");

//Routes
module.exports = function (app) {

    //scrape
    app.get("/scrape", function (req, res) {

        //Get Nerdist Articles
        request("http://nerdist.com/tag/doctor-who/", function (error, response, html) {

            //check for error
            if(error){
                throw error;
            }

            var $ = cheerio.load(html);

            $(".grid_item").each(function (i, element) {

                //create empty newsPost object
                var newsPost = {};

                newsPost.title = $(this).find(".list-item-main-title").text();
                newsPost.url = $(this).attr("href");
                newsPost.img = $(this).find(".grid_image").attr("data-2x2");
                newsPost.src = "Nerdist";

                // Send to database
                var entry = new Article(newsPost);

                entry.save(function (err, doc) {
                    //check for errors
                    if(err){
                        if(err.code === 11000){
                            console.log("duplicate article found")
                        }
                        else {
                            console.log(err);
                        }
                    }
                    else {
                        console.log(doc);
                    }
                })

            })
        });

        //Get io9 Articles
        request("http://gizmodo.com/tag/doctor-who", function (error, response, html) {

            if(error){
                throw error;
            }

            var $ = cheerio.load(html);

            //create empty newsPost object
            var newsPost = {};

            $(".js_post_item").each(function (i, element) {

                newsPost.title = $(this).find("h1").text();
                newsPost.url = $(this).find("a").attr("href");
                newsPost.img = $(this).find("picture").find("source").first().attr("data-srcset");
                newsPost.src = "io9";

                //Send to database
                var entry = new Article(newsPost);

                console.log("io9", newsPost);

                entry.save(function (err, doc) {
                    if(err){
                        if(err.code === 11000){
                            console.log("duplicate article found")
                        }
                        else {
                            console.log(err);
                        }
                    }
                    else {
                        console.log(doc);
                    }
                });
            })
        });


        res.redirect("/");
    });

    //return articles
    app.get("/", function (req, res) {

        console.log("GET!!");
        Article.find({}, function (error, doc) {
            if(error){
                res.send(error);
            }

            res.render("index", {
                article: doc
            })
        })
    })
};
