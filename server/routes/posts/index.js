const router = require('express').Router();
const controller = require('./posts.controller');
const { isLoggedIn } = require('../middlewares');

router.post('/writePost', isLoggedIn, controller.writePost);
router.get('/getPosts', controller.getPosts);
router.get('/getPost', controller.getPost);
router.post('/editPost', isLoggedIn, controller.editPost);
router.post('/removePost', isLoggedIn, controller.removePost);
router.post('/recommendPost', isLoggedIn, controller.recommendPost);
router.post('/unrecommendPost', isLoggedIn, controller.unrecommendPost);

router.post('/addComment', isLoggedIn, controller.addComment);
router.post('/removeComment', isLoggedIn, controller.removeComment);
router.post('/addReplyComment', isLoggedIn, controller.addReplyComment);
router.post('/removeReplyComment', isLoggedIn, controller.removeReplyComment);

module.exports = router;
