const express = require('express');
const Post = require('../models/post');
const checkAuth = require('../middleware/check-auth');
const PostController = require('../Controllers/posts');
const extractFile = require('../middleware/file');

const router = express.Router();

router.post('', checkAuth, extractFile, PostController.createPosts);

router.get('', PostController.getPosts);

router.get("/:id", PostController.getPost);

router.delete('/:id', checkAuth, PostController.deletePost)

router.put('/:id', checkAuth, extractFile, PostController.updatePost)

module.exports = router;