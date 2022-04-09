const path = require('path');
const fs = require('fs');
const multer = require('multer');
const { User } = require('../models');

const diskStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads');
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const filename = path.basename(file.originalname, ext);
    cb(null, filename + '_' + Date.now() + ext);
  },
});

const uploader = multer({
  storage: diskStorage,
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
    allowedMimeTypes.map((type) => {
      if (file.mimetype !== type) {
        return cb(new Error('허용되지 않은 파일 확장자입니다'), false);
      }
      cb(null, true);
    });
  },
});

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

exports.uploadFiles = async (req, res, next) => {
  !fs.existsSync('uploads') && fs.mkdirSync('uploads');

  try {
    uploader.array('files')(req, res, (error) => {
      if (error instanceof multer.MulterError) {
        return res.status(400).json({ success: false, message: error.message });
      } else if (error) {
        return res.status(400).json({
          success: false,
          message: '허용되지 않은 파일 확장자입니다.',
        });
      }
      next();
    });
  } catch (error) {
    console.error(error);
  }
};
