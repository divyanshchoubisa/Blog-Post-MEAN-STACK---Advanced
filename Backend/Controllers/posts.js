const Post = require('../models/post');
const checkAuth = require('../middleware/check-auth');


exports.createPosts =  (req, res, next) => {
    const url = req.protocol + '://' + req.get("host");
    const post = new Post({
        title: req.body.title,
        content: req.body.content,
        imagePath: url + '/images/' + req.file.filename,
        creator: req.userData.userId
    });
    post.save().then((createdPost) => {
        res.status(201).json({
            message: 'Post Added Successfully',
            post: {
                //...createdPost,
                id: createdPost._id,
                title: createdPost.title,
                content:  createdPost.content,
                imagePath: createdPost.imagePath
            }
        });
    }).catch(error => {
        res.status(500).json({
            message:"Creating a post failed !"
        })
    })
}

exports.updatePost =  (req, res, next) => {
    
    let imagePath = req.body.imagePath;
    
    if(req.file){
        const url = req.protocol + '://' + req.get("host");
        imagePath = url + '/images/' + req.file.filename
    }
    const post = new Post({
        _id: req.body.id,
        title: req.body.title,
        content: req.body.content,
        imagePath: imagePath,
        creator: req.userData.userId
    });
    
    Post.updateOne({_id: req.params.id, creator: req.userData.userId}, post).then(result => {
        
        if(result.matchedCount > 0){
            res.status(200).json({
                message:"Post Successfully Updated !"
            })
        }
        else{
            res.status(401).json({
                message:"Unauthorized"
            })
        }
    }).catch(error => {
        res.status(500).json({
            message:"Couldn't Update Post !"
        })
    })
}

exports.getPosts = (req, res, next) => {
    
    const pageSize = +req.query.pageSize;
    const currentPage = +req.query.page;
    const postQuery = Post.find();
    let fetchedPosts;


    if(pageSize && currentPage){
        postQuery
        .skip(pageSize * (currentPage - 1))
        .limit(pageSize);
    }

    postQuery.then(documents => {
        fetchedPosts = documents;
        return Post.count();
    }).then(count => {
        res.status(200).json({
            message: "Posts Fetched Successfully!",
            posts: fetchedPosts,
            maxPosts: count
        })
    }).catch(error => {
        res.status(500).json({
            messsage:"Fetching Posts Failed !"
        })
    })
}

exports.getPost =  (req, res, next) => {
    
    Post.findById(req.params.id).then(post => {
     
        if(post){
            res.status(200).json({post});
        }
     
        else{
            res.status(404).json({
                message:'Post Not Found !'
            });
        }
    }).catch(error => {
        res.status(500).json({
            messsage:"Fetching Post Failed !"
        })
    })
}

exports.deletePost =  (req, res, next) => {

    Post.deleteOne({_id: req.params.id, creator: req.userData.userId}).then(result => {
        
        if(result.deletedCount > 0){
            res.status(200).json({
                message:"Post Deleted Successfully !"
            })
        }
        else{
            res.status(401).json({
                message:"Unauthorized"
            })
        }
    }).catch(error => {
        res.status(500).json({
            message:"Deleting A Post  Failed !"
        })
    })

}