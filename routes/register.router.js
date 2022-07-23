const express = require('express');

const router = express.Router();
const bcrypt = require('bcrypt');
const { User } = require('../db/models');
const { checkAuth } = require('../middlewares/checkAuth');

router
  .route('/')
  .get(checkAuth, async (req, res) => {
    res.render('register');
  })
  .post(checkAuth, async (req, res) => {
    try {
      const {
        email, name, password, password2,
      } = req.body;
      if (email && name && password && password2) {
        if (password === password2) {
          const hashPass = await bcrypt.hash(
            password,
            Number(process.env.SALTROUNDS),
          );
          const user = await User.create({
            email,
            name,
            password: hashPass,
          });
          req.session.userId = user.id;
          req.session.userName = user.name;
          res.json({ message: 'aaa' });
        } else {
          const message = 'пароли не совпадают';
          res.json({ message: `${message}` });
        }
      } else {
        const message = 'все поля должны быть заполнены';
        res.json({ message: `${message}` });
      }
    } catch (err) {
      console.log(err);
      const { name, email } = req.body;
      const user = await User.findOne({ where: { name, email } });
      const userName = await User.findOne({ where: { name } });
      if (user) {
        const message = 'пользователь с таким email и логином уже существует';
        res.json({ message: `${message}` });
      } else if (userName) {
        const message = 'пользователь с таким логином уже существует';
        res.json({ message: `${message}` });
      } else {
        const message = 'пользователь с таким email уже существует';
        res.json({ message: `${message}` });
      }
    }
  });

module.exports = router;
