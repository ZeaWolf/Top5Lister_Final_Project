const CommunityList = require('../models/communitylist-model');
const Top5List = require('../models/top5list-model');
const User = require('../models/user-model');

// create
createCommunityList = (req, res) => {
    const body = req.body;
    
    console.log(body)
    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a Community List',
        })
    }
    const communityList = new CommunityList(body);
    console.log("creating CommunityList: " + JSON.stringify(communityList));
    if (!communityList) {
        return res.status(400).json({ success: false, error: err })
    }

    communityList
        .save()
        .then(() => {
            return res.status(201).json({
                success: true,
                communityList: communityList,
                message: 'Community List Created!'
            })
        })
        .catch(error => {
            return res.status(400).json({
                error,
                message: 'Community List Not Created!'
            })
        })
}

//Update
updateCommunityList = async (req, res) => {
    try{
        //const loggedInUser = await User.findOne({ _id: req.userId });
        const body = req.body
        console.log("updateCommunityList: " + JSON.stringify(body));
        if (!body) {
            return res.status(400).json({
                success: false,
                error: 'You must provide a body to update',
            })
        }
    
        CommunityList.findOne({ _id: req.params.id }, (err, communityList) => {
            console.log("communityList found: " + JSON.stringify(communityList));
            if (err) {
                return res.status(404).json({
                    err,
                    message: 'Community List not found!',
                })
            }

            // if(top5List.ownerEmail !== loggedInUser.email){
            //     return res.status(400).json({ 
            //         success: false, 
            //         message: "Top 5 List not owned by the user" 
            //     });
            // }
    
            communityList.name = body.name;
            communityList.itemScores = body.itemScores;
            communityList.view = body.view;
            communityList.like= body.like
            communityList.dislike= body.dislike;
            communityList.likeList= body.likeList
            communityList.dislikeList= body.dislikeList;
            communityList.comments= body.comments;
            communityList.publishDate= body.publishDate;
            communityList.updateDate = body.updateDate;
            communityList
                .save()
                .then(() => {
                    console.log("SUCCESS!!!");
                    return res.status(200).json({
                        success: true,
                        id: communityList._id,
                        message: 'Community List updated!',
                    })
                })
                .catch(error => {
                    console.log("FAILURE: " + JSON.stringify(error));
                    return res.status(404).json({
                        error,
                        message: 'Community not updated!',
                    })
                })
        })
    }catch(err){
        console.error(err);
        res.status(500).send();
    }
}

//Delete
deleteCommunityList = async (req, res) => {
    try{
        //const loggedInUser = await User.findOne({ _id: req.userId });
        CommunityList.findById({ _id: req.params.id }, (err, communityList) => {
            if (err) {
                return res.status(404).json({
                    err,
                    message: 'Comunity List not found!',
                })
            }
            // if(top5List.ownerEmail !== loggedInUser.email){
            //     return res.status(400).json({ 
            //         success: false, 
            //         message: "Top 5 List not owned by the user" 
            //     });
            // }
            CommunityList.findOneAndDelete({ _id: req.params.id }, () => {
                return res.status(200).json({ success: true, data: communityList })
            }).catch(err => console.log(err))
        })
    }catch(err){
        console.error(err);
        res.status(500).send();
    }
}

//Get by Id
getCommunityListById = async (req, res) => {
    try{
        //const loggedInUser = await User.findOne({ _id: req.userId });
        await CommunityList.findById({ _id: req.params.id }, (err, list) => {
            if (err) {
                return res.status(400).json({ success: false, error: err });
            }
            // if(list.ownerEmail !== loggedInUser.email){
            //     return res.status(400).json({ success: false, message: "Top 5 List not owned by the user" });
            // }
            return res.status(200).json({ success: true, communityList: list })
        }).catch(err => console.log(err))
    }catch(err){
        console.error(err);
        res.status(500).send();
    }
}


//Get All
getCommunityListPairs = async (req, res) => {
    try{
        console.log("Here")
        const criteria = req.query;
        if(criteria.screen === "communityScreen"){
            await CommunityList.find({ }, (err, communityLists) => {
                if (err) {
                    return res.status(400).json({ success: false, error: err })
                }
                if (!communityLists) {
                    console.log("!communityLists.length");
                    return res
                        .status(404)
                        .json({ success: false, error: 'Community Lists not found' })
                }
                else {
                    // PUT ALL THE LISTS INTO ID, NAME PAIRS
                    let pairs = [];
                    for (let key in communityLists) {
                        let list = communityLists[key];
                        let pair = {
                            _id: list._id,
                            name: list.name,
                            itemScores: list.itemScores,
                            view: list.view,
                            like: list.like,
                            dislike: list.dislike,
                            likeList: list.likeList,
                            dislikeList: list.dislikeList,
                            comments: list.comments,
                            publishDate: list.publishDate,
                            updateDate: list.updateDate,
                        };
                        pairs.push(pair);
                    }
                    return res.status(200).json({ success: true, idNamePairs: pairs })
                }
            }).catch(err => console.log(err))
        }
    }catch(err){
        console.error(err);
        res.status(500).send();
    }
}

module.exports = {
    createCommunityList,
    getCommunityListPairs,
    getCommunityListById,
    updateCommunityList,
    deleteCommunityList,
}