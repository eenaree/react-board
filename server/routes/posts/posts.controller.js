const { Comment, File, Post, User, Sequelize } = require('../../models');

exports.writePost = async (req, res) => {
  try {
    const newPost = await Post.create({
      title: req.body.title,
      contents: req.body.contents,
      UserId: res.locals.user.id,
    });

    const saveFiles = req.files.map((file) => {
      File.create({ fileUrl: file.path, PostId: newPost.id });
    });

    await Promise.all(saveFiles);

    res.json({ success: true, message: '포스트 등록 성공', post: newPost });
  } catch (error) {
    console.error(error);
  }
};

exports.getPosts = async (req, res) => {
  try {
    const { count, rows } = await Post.findAndCountAll({
      attributes: {
        include: [
          [
            Sequelize.fn(
              'DATE_FORMAT',
              Sequelize.col('Post.createdAt'),
              '%y.%m.%d'
            ),
            'createdAt',
          ],
        ],
      },
      include: [{ model: User, attributes: { exclude: ['password'] } }],
      limit: 10,
      offset: req.query.page * 10 - 10,
      order: [['createdAt', 'DESC']],
    });

    res.json({ success: true, posts: rows, count });
  } catch (error) {
    console.error(error);
  }
};

exports.getPost = async (req, res) => {
  try {
    const post = await Post.findByPk(req.query.postId, {
      attributes: {
        include: [
          [
            Sequelize.fn(
              'DATE_FORMAT',
              Sequelize.col('Post.createdAt'),
              '%Y.%m.%d %H:%i'
            ),
            'createdAt',
          ],
        ],
      },
      include: [
        { model: User, attributes: { exclude: ['password'] } },
        {
          model: User,
          as: 'recommenders',
          attributes: { exclude: ['password'] },
        },
        {
          model: Comment,
          paranoid: false,
          attributes: {
            include: [
              [
                Sequelize.fn(
                  'DATE_FORMAT',
                  Sequelize.col('Comments.createdAt'),
                  '%Y.%m.%d %H:%i'
                ),
                'createdAt',
              ],
            ],
          },
          include: [
            { model: User, attributes: { exclude: ['password'] } },
            {
              model: Comment,
              as: 'replies',
              paranoid: false,
              include: [{ model: User, attributes: { exclude: ['password'] } }],
              attributes: {
                include: [
                  [
                    Sequelize.fn(
                      'DATE_FORMAT',
                      Sequelize.col('Comments.createdAt'),
                      '%Y.%m.%d %H:%i'
                    ),
                    'createdAt',
                  ],
                ],
              },
            },
          ],
        },
        { model: File },
      ],
    });

    if (!post) {
      return res
        .status(400)
        .json({ success: false, message: '포스트가 존재하지 않습니다.' });
    }
    res.json({ success: true, post });
  } catch (error) {
    console.error(error);
  }
};

exports.editPost = async (req, res) => {
  try {
    const { postId, title, contents } = req.body;
    const updatePost = Post.update(
      { title, contents },
      { where: { id: postId } }
    );
    const saveFiles = req.files.map((file) => {
      File.create({ fileUrl: file.path, PostId: postId });
    });

    await Promise.all([updatePost, saveFiles]);

    const updatedPost = await Post.findByPk(req.body.postId);
    res.json({ success: true, message: '포스트 수정 성공', post: updatedPost });
  } catch (error) {
    console.error(error);
  }
};

exports.removePost = async (req, res) => {
  try {
    await Post.destroy({ where: { id: req.body.postId } });
    res.json({ success: true, message: '포스트 삭제 성공' });
  } catch (error) {
    console.error(error);
  }
};

exports.recommendPost = async (req, res) => {
  try {
    const post = await Post.findByPk(req.body.postId);
    if (!post) {
      return res
        .status(400)
        .json({ success: false, message: '포스트가 존재하지 않습니다.' });
    }

    await post.addRecommender(res.locals.user);
    res.json({ success: true, message: '포스트 추천 성공' });
  } catch (error) {
    console.error(error);
  }
};

exports.unrecommendPost = async (req, res) => {
  try {
    const post = await Post.findByPk(req.body.postId);
    if (!post) {
      return res
        .status(400)
        .json({ success: false, message: '포스트가 존재하지 않습니다.' });
    }

    await post.removeRecommender(res.locals.user);
    res.json({ success: true, message: '포스트 추천 취소 성공' });
  } catch (error) {
    console.error(error);
  }
};

exports.addComment = async (req, res) => {
  try {
    const post = Post.findByPk(req.body.postId);
    const newComment = Comment.create({
      comment: req.body.comment,
      UserId: res.locals.user.id,
    });
    const results = await Promise.all([post, newComment]);
    await results[0].addComment(results[1]);

    const commentWithUserInfo = await Comment.findByPk(results[1].id, {
      attributes: {
        include: [
          [
            Sequelize.fn(
              'DATE_FORMAT',
              Sequelize.col('Comment.createdAt'),
              '%Y.%m.%d %H:%i'
            ),
            'createdAt',
          ],
        ],
      },
      include: [
        { model: User, attributes: { exclude: ['password'] } },
        { model: Comment, as: 'replies' },
      ],
    });

    res.json({
      success: true,
      message: '댓글 추가 성공',
      comment: commentWithUserInfo,
    });
  } catch (error) {
    console.error(error);
  }
};

exports.removeComment = async (req, res) => {
  try {
    await Comment.destroy({ where: { id: req.body.commentId } });

    const removedComment = await Comment.findByPk(req.body.commentId, {
      paranoid: false,
    });
    res.json({
      success: true,
      message: '댓글 삭제 성공',
      deletedAt: removedComment.deletedAt,
    });
  } catch (error) {
    console.error(error);
  }
};

exports.addReplyComment = async (req, res) => {
  try {
    const comment = Comment.findByPk(req.body.commentId);
    const newReplyComment = Comment.create({
      comment: req.body.comment,
      UserId: res.locals.user.id,
    });
    const results = await Promise.all([comment, newReplyComment]);
    await results[0].addReply(results[1]);

    const commentWithUserInfo = await Comment.findByPk(results[1].id, {
      attributes: {
        include: [
          [
            Sequelize.fn(
              'DATE_FORMAT',
              Sequelize.col('Comment.createdAt'),
              '%Y.%m.%d %H:%i'
            ),
            'createdAt',
          ],
        ],
      },
      include: [{ model: User, attributes: { exclude: ['password'] } }],
    });
    res.json({
      success: true,
      message: '대댓글 추가 성공',
      comment: commentWithUserInfo,
    });
  } catch (error) {
    console.error(error);
  }
};

exports.removeReplyComment = async (req, res) => {
  try {
    await Comment.destroy({ where: { id: req.body.commentId } });

    const removedComment = await Comment.findByPk(req.body.commentId, {
      paranoid: false,
    });
    res.json({
      success: true,
      message: '대댓글 삭제 성공',
      deletedAt: removedComment.deletedAt,
    });
  } catch (error) {
    console.error(error);
  }
};

exports.removeFile = async (req, res) => {
  try {
    await File.destroy({ where: { id: req.body.fileId } });
    res.json({ success: true, message: '첨부파일 삭제 성공' });
  } catch (error) {
    console.error(error);
  }
};

exports.incrementViews = async (req, res) => {
  try {
    await Post.increment({ views: 1 }, { where: { id: req.body.postId } });
    res.json({ success: true, message: '포스트 조회수 1 증가 성공' });
  } catch (error) {
    console.error(error);
  }
};
