const morgan = require('morgan');
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const { sequelize } = require('./models');
const routes = require('./routes');

const app = express();

const sessionOptions = {
  resave: false,
  saveUninitialized: true,
  secret: process.env.SESSION_SECRET,
  cookie: {
    httpOnly: true,
    secure: false,
  },
};

const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
};

app.set('port', process.env.PORT || 8080);

(async function () {
  try {
    await sequelize.sync();
    console.log('db 연결 성공!');
  } catch (error) {
    console.error(error);
    console.log('db 연결 실패...');
  }
})();

app.use(morgan('dev'));
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session(sessionOptions));

app.use('/api', routes);

app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(500).send('서버 오류 발생!!!');
});

app.listen(app.get('port'), () => {
  console.log(`${app.get('port')}번 포트에서 서버 대기 중...`);
});
