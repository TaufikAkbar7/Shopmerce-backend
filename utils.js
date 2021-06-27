const jwt = require("jsonwebtoken");

exports.generateToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      user_type_id: user.user_type_id
    },
    process.env.JWT_SECRET, 
  );
};

exports.isAuth = (req, res, next) => {
  const authorization = req.headers['authorization'];
  if (!authorization) {
    res.status(401).send({ message: "No Token" });
  }
  const token = authorization && authorization.split(' ')[1]; // Bearer XXXXXX
  jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
    if (err) {
      res.status(401).send({ message: "Invalid Token" });
    }
    req.user = decode;
    next();
  });
};

exports.isAdmin = (req, res, next) => {
  if (req.user.user_type_id === 1) {
    next();
  } else {
    res.status(401).send({ message: "Not Allowed to Access!" });
  }
};

exports.isCustomer = (req, res, next) => {
  if (req.user.user_type_id === 0) {
    next();
  } else {
    res.status(401).send({ message: "Invalid Customer Token" });
  }
};

exports.isSeller = (req, res, next) => {
  if (req.user.user_type_id === 2) {
    next();
  } else {
    res.status(401).send({ message: "Not Allowed to Access!" });
  }
};

exports.isSellerOrAdmin = (req, res, next) => {
  if (req.user.user_type_id === 1 || req.user.user_type_id === 2) {
    next();
  } else {
    res.status(401).send({ message: "Invalid Admin/Seller Token" });
  }
};
