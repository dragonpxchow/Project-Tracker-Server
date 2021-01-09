import jwt from "jsonwebtoken";
import config from "config";

//module.exports = function (req, res, next) {
export default (req, res, next) => {
  if (!config.get("requiresAuth")) return next();

  let token = req.header("x-auth-token");
  console.log("User token >>>>>", ">>>>" + token + "<<<");

  // suprise why null is string
  if (!token || token === "null") {
    return res.status(401).json({
      msg: "No authenticaiton token, Authorisation denied",
    });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_TOKEN_KEY); //config.get("jwtPrivateKey"));
    if (!verified)
      res.status(401).json({
        status: 401,
        msg: "Token verification failed, Authorisation denied",
      });

    req.user = verified;
    next();
  } catch (error) {
    res.json({ status: 500, msg: error });
    //res.status(500).json({ msg: err });
  }
};
