const express = require('express');
const fs = require('fs').promises;
const { User, Post, Like } = require('../db/models');

const router = express.Router();
const upload = require('../middlewares/multer.middleware');

// добавление
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

// удаление
router
  .route('/:id')
  .delete(async (req, res) => {
    try {
      const { id } = req.params;
      const post = await Post.findOne({ where: { id } });
      if (post.user_id === res.locals.userId) {
        const delPost = await Post.destroy({
          where: { id: req.params.id },
        });
        const fileName = post.image;
        await fs.unlink(`${process.env.PWD}/public${fileName}`, (err) => {
          if (err) throw err; // не удалось удалить файл
          console.log('Файл успешно удалён');
        });

        res.json(delPost);
      }
    } catch (error) {
      console.log(error);
      res.json({ error });
    }
  })

  // редактирование
  .get(async (req, res) => {
    try {
      const post = await Post.findOne({ where: { id: req.params.id } });
      res.json(post);
    } catch (error) {
      console.log(error);
    }
  })

  // добавляем новую редакцию
  .put(async (req, res) => {
    try {
      const { id } = req.params;
      await Post.update(
        {
          text: req.body.text,
        },
        { where: { id } }
      );
      const post = await Post.findOne({ where: { id }, raw: true });
      const user = await User.findOne({
        where: { id: res.locals.userId },
        raw: true,
      });
      const likes = await Like.findAll({ where: { post_id: id }, raw: true });
      post.user_name = user.name;
      post.likes = likes.length;
      res.json(post);
    } catch (err) {
      console.log(err);
    }
  });

module.exports = router;
