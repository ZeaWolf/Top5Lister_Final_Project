const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CommunityListSchema = new Schema(
    {
        name: { type: String, required: true },
        itemScores: { type: { String : Number }, required: true },
        view: { type : Number, required: true},
        like: { type: Number, required: true},
        dislike: { type: Number, required: true},
        likeList: {type: [String], required: true},
        dislikeList: {type: [String], required: true},
        comments: { type: [[String]], required: true },
        publishDate:{type: Date, required: true},
        updateDate:{type: Date, required: true},
    },
    { timestamps: true },
)


module.exports = mongoose.model('CommunityList', CommunityListSchema)