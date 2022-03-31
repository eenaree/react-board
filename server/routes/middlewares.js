const { User } = require('../models');

exports.isLoggedIn = async (req, res, next) => {
  try {
    if (!req.session.user) {
      return res
        .status(403)
        .json({ success: false, message: '로그인 상태가 아닙니다.' });
    }

    const user = await User.findOne({
      where: { email: req.session.user.email },
    });
    res.locals.user = user;
    next();
  } catch (error) {
    console.error(error);
  }
};
