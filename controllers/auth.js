import Joi from "joi";
import bcrypt from "bcryptjs";
import _ from "lodash";
import { User } from "../models/user.js";

export const login = async (req, res) => {
  try {
    //console.log("Server user login >>>>>>>", req.body);
    const { error } = validate(req.body);
    if (error)
      return res
        .status(400)
        .json({ name: "UserLoginError", error: error.details[0].message });

    const { email, password } = req.body;

    let user = await User.findOne({ email: email });
    if (!user)
      return res
        .status(400)
        .json({ name: "UserLoginError", error: "User does not exist" });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword)
      return res
        .status(400)
        .json({ name: "UserLoginError", error: "Invalid credentials" });

    //const token = user.generateAuthToken();
    //res.send(token);

    // generate user's jwt token and send back
    const token = user.generateAuthToken();
    res
      .header("x-auth-token", token)
      .header("access-control-expose-headers", "x-auth-token") // add custom header
      .json({
        token,
        user: _.pick(user, ["_id", "email", "firstName", "lastName"]),
      });
  } catch (err) {
    res.status(500).json({ name: "UserLoginError", error: err.message });
  }
};

function validate(req) {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
  });

  return schema.validate(req);
}
