const router = require('express').Router();
const controller = require('./posts.controller');
const { isLoggedIn, uploadFiles } = require('../middlewares');

router.post('/writePost', isLoggedIn, uploadFiles, controller.writePost);
router.get('/getPosts', controller.getPosts);
router.get('/getPost', controller.getPost);
router.post('/editPost', isLoggedIn, uploadFiles, controller.editPost);
router.post('/removePost', isLoggedIn, controller.removePost);
router.post('/recommendPost', isLoggedIn, controller.recommendPost);
router.post('/unrecommendPost', isLoggedIn, controller.unrecommendPost);
router.get('/searchPost', controller.searchPost);

router.post('/addComment', isLoggedIn, controller.addComment);
router.post('/removeComment', isLoggedIn, controller.removeComment);
router.post('/addReplyComment', isLoggedIn, controller.addReplyComment);
router.post('/removeReplyComment', isLoggedIn, controller.removeReplyComment);
router.post('/addLikeComment', isLoggedIn, controller.addLikeComment);
router.post('/addDislikeComment', isLoggedIn, controller.addDislikeComment);
router.post('/removeLikeComment', isLoggedIn, controller.removeLikeComment);
router.post(
  '/removeDislikeComment',
  isLoggedIn,
  controller.removeDislikeComment
);

router.post('/removeFile', isLoggedIn, controller.removeFile);
router.post('/incrementViews', controller.incrementViews);

module.exports = router;
