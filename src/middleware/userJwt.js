const jwt = require("jsonwebtoken");

module.exports = async function(req, res, next) {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({
      msg: "No Token, Authorization denied",
    });
  }

  try {
    await jwt.verify(token, process.env.jwtUserSecret, (err, decoded) => {
      if (err) {
        return res.status(401).json({
          msg: "Invalid Token, Authorization denied",
        }); 
      } else {
        req.user = decoded.user;
        next();
      }
    });
  } catch (err) {
    console.log("Something went wrong with middleware " + err);
    return res.status(500).json({
      msg: "Internal Server Error",
    });
  }
}
