import express from "express";
import auth from "../middleware/auth.js";
import {
  getUser,
  getUsers,
  registerUser,
  deleteUser,
  tokenIsValid,
} from "../controllers/users.js";

const router = express.Router();

router.get("/", getUsers);
router.get("/me", auth, getUser); // router.get("/:id" ..
router.post("/register", registerUser);
router.delete("/delete", auth, deleteUser);
router.post("/tokenisvalid", tokenIsValid);
// router.get("/", auth, getUsers);  use middleware
//router.post("/", createPost);
//router.patch("/:id", updatePost);
//router.delete("/:id", deletePost);
//router.patch("/:id/likePost", likePost);

export default router;
