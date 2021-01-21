import jwt from "jsonwebtoken";
import config from "config";

//module.exports = function (req, res, next) {
export default (req, res, next) => {
  if (!config.get("requiresAuth")) return next();

  let token = req.header("x-auth-token");

  /*
  console.log(
    "authMiddleware User token >>>>>>>>>>>>>>>>>>>>",
    ">>>>" + token + "<<<"
  );
  */

  //  null or undefined is string from header
  if (!token || token === "null" || token === "undefined") {
    return res.status(401).json({
      name: "JsonWebTokenError",
      error: "No authenticaiton token, Authorisation denied",
    });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_TOKEN_KEY); //config.get("jwtPrivateKey"));
    if (!verified) {
      res.status(401).json({
        name: "JsonWebTokenError",
        error: "Token verification failed, Authorisation denied",
      });
    }

    // return user data
    req.user = verified;
    next();
  } catch (error) {
    // {name: "JsonWebTokenError", message: "jwt malformed"}
    res.status(500).json({ name: error.name, error: error.message });
  }
};
