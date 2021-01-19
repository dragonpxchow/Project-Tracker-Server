import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import _ from "lodash";
import { User, validateUser } from "../models/user.js";

// get al users
export const getUsers = async (req, res) => {
  // get all users
  const users = await User.find().select("-__v").sort("name"); // except version __v
  res.send(users);
};

// get single user
export const getUser = async (req, res) => {
  //console.log("Server getUser controller >>>>", req.user);
  const user = await User.findById(req.user._id).select("-password"); // except password
  res.json(user);
};

export const registerUser = async (req, res) => {
  try {
    // validate data first
    const { error } = validateUser(req.body);
    if (error)
      return res
        .status(400)
        .json({ name: "ValidatingUserError", error: error.details[0].message });

    // then check for user existence
    let user = await User.findOne({ email: req.body.email });
    if (user)
      return res.status(400).json({
        name: "ValidatingUserError",
        error: "User already registered.",
      });

    // all good, then submit new user
    user = new User(
      _.pick(req.body, ["email", "password", "firstName", "lastName"])
    );
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();

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
    res.status(500).json({ name: error.name, error: err.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    //console.log("delete user >>>", req.user);
    const deletedUser = await User.findByIdAndDelete(req.user);
    res.json(deletedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const tokenIsValid = async (req, res) => {
  try {
    const token = req.header("x-auth-token");
    if (!token) res.json(false);

    const verified = jwt.verify(token, process.env.JWT_TOKEN_KEY); //config.get("jwtPrivateKey"));
    if (!verified) res.json(false);

    const user = await User.findById(verified._id);
    if (!user) res.json(false);

    return res.json(true);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
