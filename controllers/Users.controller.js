const Users = require("../models/Users.model");
const Categories = require("../models/Categories.model");
const Todos = require("../models/Todos.model");
const RefreshTokens = require("../models/RefreshToken.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const createError = require("http-errors");

module.exports = {
  logout: async (req, res, next) => {
    try {
      const refreshTokens = await RefreshTokens.find({
        userId: req.body.userId
      });
      if (!refreshTokens.length) {
        throw createError(401, "No refresh tokens found.");
      }

      if (refreshTokens.length === 1) {
        await refreshTokens[0].delete();
        const user = await Users.findOne(
          { _id: req.body.userId },
          "+authenticated"
        );
        user.authenticated = false;
        await user.save();
        res.status(200).json({
          message: "Refresh token disabled."
        });
      } else {
        if (req.body.refreshToken) {
          const refreshToken = refreshTokens.find(
            refreshToken => refreshToken.token === req.body.refreshToken
          );
          if (!refreshToken) throw createError(401, "Invalid refresh token.");
          await refreshToken.delete();
          res.status(200).json({
            message: "Refresh token disabled."
          });
        } else {
          await refreshTokens.forEach(refreshToken => refreshToken.delete());
          const user = await Users.findOne(
            { _id: req.body.userId },
            "+authenticated"
          );
          user.authenticated = false;
          await user.save();
          res.status(200).json({
            message:
              "Refresh tokens disabled. User needs to authenticate go gain access again."
          });
        }
      }
    } catch (error) {
      return next(error);
    }
  },
  refreshToken: async (req, res, next) => {
    try {
      const refreshToken = await RefreshTokens.findOne({
        token: req.body.refreshToken
      });
      if (!refreshToken) throw createError(401, "Invalid refresh token.");

      const decoded = await jwt.verify(
        refreshToken.token,
        req.app.get("secretKey"),
        (error, decoded) => {
          if (error) {
            throw createError(
              401,
              "Could not verify refresh token. Please authenticate to generate new access and refresh token."
            );
          }
          return decoded;
        }
      );

      const newAccessToken = jwt.sign(
        { id: decoded.id },
        req.app.get("secretKey"),
        { expiresIn: req.app.get("tokenExpiresIn") }
      );

      res.status(200).json({
        message: "Successfully generated new access token",
        data: {
          accessToken: newAccessToken
        }
      });
    } catch (error) {
      return next(error);
    }
  },
  delete: async (req, res, next) => {
    try {
      const user = await Users.findOne({ _id: req.body.userId }, "+password");
      if (!user) throw createError(404, "Could not find user to delete.");

      // Check password first.
      const match = await bcrypt.compare(req.body.password, user.password);
      if (!match) throw createError(403, "Wrong user password.");

      await user.remove();
      await Categories.deleteMany({ userId: req.body.userId });
      await Todos.deleteMany({ userId: req.body.userId });
      await RefreshTokens.deleteMany({ userId: req.body.userId });

      res.status(204).json({
        message: "User and related data has been deleted."
      });
    } catch (error) {
      return next(error);
    }
  },
  getUser: async (req, res, next) => {
    try {
      const user = await Users.findById(req.body.userId);
      if (!user) throw createError(404, "User not found.");

      res.status(200).json({
        message: "Found user.",
        data: user
      });
    } catch (error) {
      return next(error);
    }
  },
  update: async (req, res, next) => {
    try {
      const user = await Users.findById(req.body.userId, "+password");
      if (!user) throw createError(404, "Could not find user to update.");

      // Check password first.
      const match = await bcrypt.compare(req.body.password, user.password);
      if (!match) throw createError(403, "Wrong user password.");

      if ("name" in req.body) user.name = req.body.name;
      if ("email" in req.body) user.email = req.body.email;
      if ("newPassword" in req.body) {
        user.password = req.body.newPassword;
      }

      if (user.isModified("email")) {
        const emailExist = await Users.findOne(
          { email: req.body.email },
          "email _id"
        );
        if (emailExist && emailExist._id !== req.body.userId) {
          throw createError(409, "Email is already registered.");
        }
      }

      const newUserInfo = await user.save();
      newUserInfo.password = undefined;

      res.status(200).json({
        message: "User updated.",
        data: newUserInfo
      });
    } catch (error) {
      return next(error);
    }
  },
  authenticate: async (req, res, next) => {
    try {
      const user = await Users.findOne(
        { email: req.body.email },
        "+password +authenticated"
      );
      if (!user) throw createError(400, "Wrong email or password.");

      const match = await bcrypt.compare(req.body.password, user.password);
      if (!match) throw createError(400, "Wrong email or password.");

      const token = jwt.sign({ id: user._id }, req.app.get("secretKey"), {
        expiresIn: req.app.get("tokenExpiresIn")
      });
      let refreshToken = null;
      if (req.body.refreshToken) {
        refreshToken = jwt.sign({ id: user._id }, req.app.get("secretKey"), {
          expiresIn: "7d"
        });

        const newRefreshToken = new RefreshTokens({
          token: refreshToken,
          userId: user._id
        });

        await newRefreshToken.save();
      }

      user.authenticated = true;
      await user.save();

      res.status(200).json({
        message: "Successfully authenticated.",
        data: {
          accessToken: token,
          refreshToken: refreshToken
        }
      });
    } catch (error) {
      return next(error);
    }
  },
  create: async (req, res, next) => {
    try {
      const emailExist = await Users.findOne(
        { email: req.body.email },
        "email"
      );
      if (emailExist) throw createError(409, "Email is already registered.");

      const user = new Users({
        _id: req.body._id,
        email: req.body.email,
        password: req.body.password,
        name: req.body.name
      });

      await user.save();

      res.status(201).json({
        message: "User account is created."
      });
    } catch (error) {
      return next(error);
    }
  }
};
