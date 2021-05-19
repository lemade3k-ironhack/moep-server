// validate currentUser
const currentUser = (req, res, next) => {
  console.log(req.session.loggedInUser)
  if (req.session.loggedInUser) {
    next();
  } else {
    res.status(401).json({
      message: "Unauthorized user",
      code: 401,
    });
  }
};

module.exports = currentUser