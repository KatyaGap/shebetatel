const express = require('express');

const router = express.Router();

router.route('/').get((req, res) => {
  req.session.destroy((error) => {
    if (error) {
      console.error(error);
      return res.sendStatus(500);
    }
    res.clearCookie('auth').redirect('/');
  });
});

module.exports = router;
