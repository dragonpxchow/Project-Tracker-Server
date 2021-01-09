import usersRoutes from "../routes/usersRoutes.js";
import authRoutes from "../routes/authRoutes.js";

const routes = (app) => {
  // setup routes
  app.use("/api/users", usersRoutes);
  app.use("/api/auth", authRoutes);
};

export default routes;
