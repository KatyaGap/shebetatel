const express = require('express');
const { User, Post, Like } = require('../db/models');
const upload = require('../middlewares/multer.middleware');

const router = express.Router();

router.route('/').get(async (req, res) => {
  let posts = await Post.findAll({ raw: true, order: [['date', 'DESC']] });
  const likes = await Like.findAll({ raw: true });
  const users = await User.findAll({ raw: true });
  posts = posts.map((el) => ({
    ...el,
    user_name: users.filter((item) => item.id === el.user_id)[0].name,
    likes: likes.filter((item) => item.post_id === el.id).length,
  }));

  res.render('mainPage', { posts });
});

// добавление поста на главной странице
router.route('/').post(upload.single('image'), async (req, res) => {
  try {
    const card = await Post.create({
      user_id: res.locals.userId,
      text: req.body.text,
      description: req.body.description,
      date: JSON.stringify(new Date()).slice(1, -9).replace('T', ' '),
      image: req.file.path.replace('public', ''),
    });
    const user = await User.findOne({
      where: { id: res.locals.userId },
      raw: true,
    });
    res.json({ card, user });
  } catch (error) {
    console.log(error);
    res.json({ error });
  }
});

module.exports = router;
