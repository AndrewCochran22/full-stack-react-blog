var express = require('express');
const checkAuth = require('../auth/checkAuth');
var router = express.Router();
const models = require('../models');

/* GET posts. */
router.get('/', async function(req, res) {
    // TODO: get all posts
    const posts = await models.Post.findAll({
        include: [{
            model: models.User, 
            attributes: ['username', 'id']
        }],
    })
    res.json(posts);
});

router.post('/', checkAuth, async (req, res) => {
    // Is user logged in?
    // If not, send error(401)
    // Moved to checkAuth

    // Check for all fields
        // If some fields missing
        // Send error(400)
    if (!req.body.title || !req.body.content) {
        return res.status(400).json({
            error: 'Please include all title and content.'
        })
    }

    // Create new post
    const post = await models.Post.create({
        title: req.body.title,
        content: req.body.content,
        UserId: req.session.user.id
    })
    
    // Send back new post data
    res.status(201).json(post);
})

router.post('/:id/comments', checkAuth, async (req, res) => {
    const post = await models.Post.findByPk(req.params.id)
    if (!post) {
        res.status(404).json({
            error: "Could not find post with that Id"
        })
    }

    if (!req.body.text) {
        res.status(400).json({
            error: "Please include all required fields"
        })
    }

    const comment = await post.createComment({
        text: req.body.text,
        PostId: req.params.id,
        UserId: req.session.user.id
    })

    res.status(201).json(comment);

})

module.exports = router;
