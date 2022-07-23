const express = require('express');

const router = express.Router();
const bcrypt = require('bcrypt');
const { User } = require('../db/models');

router
  .route('/')
  .get(async (req, res) => {
    res.render('login');
  })
  .post(async (req, res) => {
    try {
      const { email, password } = req.body;
      if (email && password) {
        const user = await User.findOne({ where: { email } });
        if (!user) {
          const message = 'пользователь с таким email не зарегистрирован!';
          res.json({ message: `${message}` });
        } else {
          const passCheck = await bcrypt.compare(password, user.password);
          if (user && passCheck) {
            req.session.userId = user.id;
            req.session.userName = user.name;
            res.json({ message: 200 });
          } else {
            const message = 'введен неверный пароль!';
            res.json({ message: `${message}` });
          }
        }
      } else if (!email || !password) {
        const message = 'заполните все поля!';
        res.json({ message: `${message}` });
      }
    } catch (err) {
      console.log('err', err);
      const message = 'Произошла ошибка. Попробуй снова!';
      res.json({ message: `${message}` });
    }
  });

module.exports = router;
