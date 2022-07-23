require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const path = require('path');
const hbs = require('hbs');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const FileStore = require('session-file-store')(session);

const { checkSession } = require('./middlewares/checkAuth');

const indexRouter = require('./routes/index.router');
const registerRouter = require('./routes/register.router');
const loginRouter = require('./routes/login.router');
const logoutRouter = require('./routes/logout.router');
const postRouter = require('./routes/post.router')
const likesRouter = require('./routes/likes.router')
const lsRouter = require('./routes/ls.router')

const app = express();
const PORT = process.env.PORT ?? 3000;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(express.static(path.join(__dirname, 'public')));

hbs.registerPartials(`${__dirname}/views/partials`);
const sessionConfig = {
  name: 'auth',
  secret: 'cold',
  store: new FileStore(),
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24,
  },
  resave: false,
  saveUninitialized: false,
};


app.use(session(sessionConfig));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(process.env.PWD, 'public')));
app.use(morgan('dev'));
app.use(cookieParser());
app.use(checkSession);

app.use('/', indexRouter);
app.use('/register', registerRouter);
app.use('/login', loginRouter);
app.use('/logout', logoutRouter);
app.use('/post', postRouter);
app.use('/likes', likesRouter);
app.use('/ls', lsRouter);

app.listen(PORT, () => {
  console.log('Hello express');
});
