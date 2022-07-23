const checkAuth = (req, res, next) => {
  if (req.session.userId) {
    res.locals.userId = req.session.userId;
    res.locals.userName = req.session.userName;
    return res.redirect('/');
  }
  return next();
};
const checkSession = (req, res, next) => {
  if (req.session.userId) {
    res.locals.userId = req.session.userId;
    res.locals.userName = req.session.userName;
    return next();
  }
  return next();
};
module.exports = { checkSession, checkAuth };
