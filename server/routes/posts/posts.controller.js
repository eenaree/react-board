const { Post, User, Sequelize } = require('../../models');

exports.writePost = async (req, res) => {
  try {
    const newPost = await Post.create({
      title: req.body.title,
      contents: req.body.contents,
      UserId: res.locals.user.id,
    });

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
              '%Y.%m.%d %h:%i'
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
    await Post.update({ title, contents }, { where: { id: postId } });

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
