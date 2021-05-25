// validate currentUser
const currentUser = (req, res, next) => {
  if (req.session.loggedInUser) {
    next();
  } else {
    res.status(401).json({
      message: "Unauthorized user",
      code: 401,
    });
  }
};

const currentAdmin = (req, res, next) => {
  const currentUser = req.session.loggedInUser;
  
  if (currentUser && currentUser.admin) {
    next();
  } else {
    res.status(401).json({
      message: "Unauthorized user",
      code: 401,
    });
  }
};

module.exports = { currentUser, currentAdmin };
