const express = require('express');
const { User, Post, Like } = require('../db/models');

const router = express.Router();

router.route('/:id').get(async (req, res) => {
  try {
    const { id } = req.params;
    let posts = await Post.findAll({
      where: { user_id: id },
      raw: true,
      order: [['date', 'DESC']],
    });
    const likes = await Like.findAll({ raw: true });
    const users = await User.findAll({ raw: true });
    posts = posts.map((el) => ({
      ...el,
      user_name: users.filter((item) => item.id === el.user_id)[0].name,
      likes: likes.filter((item) => item.post_id === el.id).length,
    }));
    const checkOwn = (post) => {
      if (!post || post.user_id === res.locals.userId) return true;
      return false;
    };

    const bool = checkOwn(posts[0]);
    res.render('ls', { posts, bool });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
