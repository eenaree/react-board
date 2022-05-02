const { Op } = require('sequelize');
const { Comment, File, Post, User, Sequelize } = require('../../models');

exports.writePost = async (req, res) => {
  try {
    const newPost = await Post.create({
      title: req.body.title,
      contents: req.body.contents,
      UserId: res.locals.user.id,
    });

    const saveFiles = req.files.map(file => {
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
    const post = await Post.findByPk(req.params.id, {
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
          attributes: ['id'],
          through: { attributes: [] },
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
              model: User,
              as: 'likers',
              attributes: ['id'],
              through: { attributes: [] },
            },
            {
              model: User,
              as: 'dislikers',
              attributes: ['id'],
              through: { attributes: [] },
            },
            {
              model: Comment,
              as: 'replies',
              paranoid: false,
              through: { attributes: [] },
              include: [
                { model: User, attributes: { exclude: ['password'] } },
                {
                  model: User,
                  as: 'likers',
                  attributes: ['id'],
                  through: { attributes: [] },
                },
                {
                  model: User,
                  as: 'dislikers',
                  attributes: ['id'],
                  through: { attributes: [] },
                },
              ],
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
        .status(404)
        .json({ success: false, message: '포스트가 존재하지 않습니다.' });
    }
    res.json({ success: true, post });
  } catch (error) {
    console.error(error);
  }
};

exports.editPost = async (req, res) => {
  try {
    await Post.update(
      { title: req.body.title, contents: req.body.contents },
      { where: { id: req.params.id } }
    );
    const saveFiles = req.files.map(file => {
      File.create({ fileUrl: file.path, PostId: req.params.id });
    });

    await Promise.all(saveFiles);

    const updatedPost = await Post.findByPk(req.params.id);
    res.json({ success: true, message: '포스트 수정 성공', post: updatedPost });
  } catch (error) {
    console.error(error);
  }
};

exports.removePost = async (req, res) => {
  try {
    await Post.destroy({ where: { id: req.params.id } });
    res.json({ success: true, message: '포스트 삭제 성공' });
  } catch (error) {
    console.error(error);
  }
};

exports.recommendPost = async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id);
    if (!post) {
      return res
        .status(404)
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
    const post = await Post.findByPk(req.params.id);
    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: '포스트가 존재하지 않습니다.' });
    }

    await post.removeRecommender(res.locals.user);
    res.json({ success: true, message: '포스트 추천 취소 성공' });
  } catch (error) {
    console.error(error);
  }
};

exports.searchPost = async (req, res) => {
  try {
    if (req.query.search_type === 'all') {
      const writer = await User.findOne({
        where: { nickname: req.query.keyword },
      });
      const { count, rows } = await Post.findAndCountAll({
        where: {
          [Op.or]: [
            { title: { [Op.substring]: req.query.keyword } },
            { contents: { [Op.substring]: req.query.keyword } },
            { UserId: writer ? writer.id : 0 },
          ],
        },
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

      return res.json({ success: true, posts: rows, count });
    }

    if (req.query.search_type === 'title') {
      const { count, rows } = await Post.findAndCountAll({
        where: { title: { [Op.substring]: req.query.keyword } },
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

      return res.json({ success: true, posts: rows, count });
    }

    if (req.query.search_type === 'contents') {
      const { count, rows } = await Post.findAndCountAll({
        where: { contents: { [Op.substring]: req.query.keyword } },
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

      return res.json({ success: true, posts: rows, count });
    }

    if (req.query.search_type === 'writer') {
      const writer = await User.findOne({
        where: { nickname: req.query.keyword },
      });
      if (!writer) {
        return res.json({ success: true, posts: [], count: 0 });
      }

      const { count, rows } = await Post.findAndCountAll({
        where: { UserId: writer.id },
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

      return res.json({ success: true, posts: rows, count });
    }
  } catch (error) {
    console.error(error);
  }
};

exports.addComment = async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id);
    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: '포스트가 존재하지 않습니다.' });
    }

    const newComment = await Comment.create({
      comment: req.body.comment,
      UserId: res.locals.user.id,
      PostId: post.id,
    });

    const commentWithUserInfo = await Comment.findByPk(newComment.id, {
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
        { model: User, as: 'likers' },
        { model: User, as: 'dislikers' },
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
    await Comment.destroy({ where: { id: req.params.id } });

    const removedComment = await Comment.findByPk(req.params.id, {
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
    const comment = await Comment.findByPk(req.params.id);
    if (!comment) {
      return res
        .status(404)
        .json({ success: false, message: '댓글이 존재하지 않습니다.' });
    }

    const newReplyComment = await Comment.create({
      comment: req.body.comment,
      UserId: res.locals.user.id,
    });
    await comment.addReply(newReplyComment);

    const commentWithUserInfo = await Comment.findByPk(newReplyComment.id, {
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
        { model: User, as: 'likers' },
        { model: User, as: 'dislikers' },
      ],
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
    await Comment.destroy({ where: { id: req.params.id } });

    const removedComment = await Comment.findByPk(req.params.id, {
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

exports.addLikeComment = async (req, res) => {
  try {
    const comment = await Comment.findByPk(req.params.id);
    if (!comment) {
      return res
        .status(404)
        .json({ success: false, message: '댓글이 존재하지 않습니다.' });
    }

    await comment.addLiker(res.locals.user);
    res.json({ success: true, message: '좋아요 추가 성공' });
  } catch (error) {
    console.error(error);
  }
};

exports.addDislikeComment = async (req, res) => {
  try {
    const comment = await Comment.findByPk(req.params.id);
    if (!comment) {
      return res
        .status(404)
        .json({ success: false, message: '댓글이 존재하지 않습니다.' });
    }

    await comment.addDisliker(res.locals.user);
    res.json({ success: true, message: '싫어요 추가 성공' });
  } catch (error) {
    console.error(error);
  }
};

exports.removeLikeComment = async (req, res) => {
  try {
    const comment = await Comment.findByPk(req.params.id);
    if (!comment) {
      return res
        .status(404)
        .json({ success: false, message: '댓글이 존재하지 않습니다.' });
    }

    await comment.removeLiker(res.locals.user);
    res.json({ success: true, message: '좋아요 제거 성공' });
  } catch (error) {
    console.error(error);
  }
};

exports.removeDislikeComment = async (req, res) => {
  try {
    const comment = await Comment.findByPk(req.params.id);
    if (!comment) {
      return res
        .status(404)
        .json({ success: false, message: '댓글이 존재하지 않습니다.' });
    }

    await comment.removeDisliker(res.locals.user);
    res.json({ success: true, message: '싫어요 제거 성공' });
  } catch (error) {
    console.error(error);
  }
};

exports.removeFile = async (req, res) => {
  try {
    await File.destroy({ where: { id: req.params.id } });
    res.json({ success: true, message: '첨부파일 삭제 성공' });
  } catch (error) {
    console.error(error);
  }
};

exports.incrementViews = async (req, res) => {
  try {
    await Post.increment({ views: 1 }, { where: { id: req.params.id } });
    res.json({ success: true, message: '포스트 조회수 1 증가 성공' });
  } catch (error) {
    console.error(error);
  }
};
