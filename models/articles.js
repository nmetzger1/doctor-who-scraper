var mongoose = require("mongoose");

var Schema = mongoose.Schema;

//Create Article schema
var ArticleSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true,
        unique: true
    },
    img: {
        type: String,
        required: true
    },
    src: {
        type: String,
        required: true
    },
    comments: [{
        type: Schema.Types.ObjectId,
        ref: "Comment"
    }]
});

var Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;