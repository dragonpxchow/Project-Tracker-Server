import Joi from "joi";
import bcrypt from "bcryptjs";
import _ from "lodash";
import { User } from "../models/user.js";

export const login = async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const { email, password } = req.body;
    //console.log(email, password);

    let user = await User.findOne({ email: email });
    if (!user) return res.status(400).send("Invalid email or password."); // account not found

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword)
      return res.status(400).send("Invalid email or password.");

    //const token = user.generateAuthToken();
    //res.send(token);

    // generate user's jwt token and send back
    const token = user.generateAuthToken();
    res
      .status(200)
      .json({
        token,
        user: _.pick(user, ["_id", "email", "firstName", "lastName"]),
      });

    /*
    res
      .header("x-auth-token", token)
      .header("access-control-expose-headers", "x-auth-token") // add custom header
      .send(_.pick(user, ["_id", "name", "email"]));
    */
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

function validate(req) {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
  });

  return schema.validate(req);
}
