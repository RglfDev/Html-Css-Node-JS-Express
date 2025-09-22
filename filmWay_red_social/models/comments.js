const {
    Schema,
    model
} = require("mongoose")

const commentSchema = new Schema({
    filmId: {
        type: String,
        require: true
    },
    comments: [{
        userNick: {
            type: String,
            require: true
        },
        userComment: {
            type: String,
            require: true
        },
        dateComment: {
            type: Date,
            default: Date.now
        }
    }]
})
module.exports = model("Comments", commentSchema, "comments")