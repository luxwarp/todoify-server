const routes = require("express").Router();
const Users = require("../controllers/Users.controller");
const validateUser = require("../middlewares/userValidation");

// public routes
routes.post("/register", Users.create);
routes.post("/activate", Users.activate);
routes.post("/resetpassword", Users.resetPassword);
routes.post("/authenticate", Users.authenticate);
routes.post("/refreshToken", Users.refreshToken);

// protected routes
routes.get("/", validateUser, Users.getUser);
routes.patch("/", validateUser, Users.update);
routes.delete("/", validateUser, Users.delete);
routes.post("/logout", validateUser, Users.logout);

module.exports = routes;
