const express = require('express');
const { Like } = require('../db/models');

const router = express.Router();

router.route('/:id').get(async (req, res) => {
  try {
    const { id } = req.params;
    const like = await Like.findOne({
      where: { post_id: id, user_id: res.locals.userId },
      raw: true,
    });

    if (!like) {
      await Like.create({ user_id: res.locals.userId, post_id: id });
    } else if (like) {
      await Like.destroy({
        where: { user_id: res.locals.userId, post_id: id },
      });
    }
    const likes = await Like.findAll({ where: { post_id: id }, raw: true });
    res.json(likes);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
