const { User } = require('../../models');

exports.login = async (req, res) => {
  try {
    const user = await User.findOne({ where: { email: req.body.email } });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: '존재하지 않는 계정입니다.' });
    }

    const passwordComparedResult = await user.getPasswordComparedResult(
      req.body.password
    );
    if (!passwordComparedResult) {
      return res
        .status(400)
        .json({ success: false, message: '비밀번호가 일치하지 않습니다.' });
    }

    const { id, email, nickname } = user;
    req.session.user = { id, email, nickname };
    res.json({
      success: true,
      message: '로그인 성공',
      user: { id, email, nickname },
    });
  } catch (error) {
    console.error(error);
  }
};

exports.register = async (req, res) => {
  try {
    const exUser = await User.findOne({ where: { email: req.body.email } });
    if (exUser) {
      return res
        .status(400)
        .json({ success: false, message: '이미 존재하는 계정입니다.' });
    }

    const newUser = await User.build({
      nickname: req.body.nickname,
      email: req.body.email,
    });
    const hashedPassword = await newUser.getHashedPassword(req.body.password);
    newUser.password = hashedPassword;
    await newUser.save();

    res.json({
      success: true,
      message: '회원가입 성공',
    });
  } catch (error) {
    console.error(error);
  }
};

exports.logout = async (req, res) => {
  try {
    req.session.destroy();
    res.clearCookie('connect.sid');
    res.json({ success: true, message: '로그아웃 성공' });
  } catch (error) {
    console.error(error);
  }
};
