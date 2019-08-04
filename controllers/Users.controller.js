const Users = require("../models/Users.model");
const Categories = require("../models/Categories.model");
const Todos = require("../models/Todos.model");
const RefreshTokens = require("../models/RefreshToken.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const createError = require("http-errors");
const smtp = require("../mail/mail");
const config = require("../config/config");

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
        "+password +authenticated +activated"
      );
      if (!user) throw createError(400, "Wrong email or password.");
      if (!user.activated)
        throw createError(
          400,
          "User not activated. Check email for activation link."
        );

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
  resetPassword: async (req, res, next) => {
    try {
      const user = await Users.findOne({ email: req.body.email }, "+password");
      if (!user) throw createError(404, "No account found.");

      const randomPassword =
        Math.floor(Math.random() * (99999 - 11111)) + 11111;

      user.password = randomPassword;

      await user.save();

      smtp.sendMail({
        from: config.SMTP_DEFAULT_FROM,
        to: `${user.email}`,
        subject: "Password reset",
        html: `<h1>Hello ${user.email}.</h2> 
        <p>You have requested a new password.</p>
        
        <p>This is your new password: ${randomPassword}</p>`
      });

      res.status(201).json({
        message: "A new password has been generated and sent to your email."
      });
    } catch (error) {
      return next(error);
    }
  },
  activate: async (req, res, next) => {
    try {
      await jwt.verify(
        req.body.activationCode,
        req.app.get("secretKey"),
        (error, decoded) => {
          if (error) throw createError(401, "Not a valid token.");
          req.body.userId = decoded.id;
        }
      );

      const user = await Users.findById(req.body.userId, "+activated");
      if (!user) throw createError(404, "User not found.");
      if (user.activated) throw createError(404, "User already activated.");

      user.activated = true;

      await user.save();

      res.status(200).json({ message: `${user.email} is activated.` });
    } catch (error) {
      return next(error);
    }
  },
  resendActivationCode: async (req, res, next) => {
    try {
      const user = await Users.findOne({ email: req.body.email }, "+activated");
      if (!user) throw createError(404, "User not found.");
      if (user.activated)
        throw createError(400, "User account is already activated.");

      const activateToken = jwt.sign(
        { id: user._id },
        req.app.get("secretKey"),
        {
          expiresIn: req.app.get("tokenExpiresIn")
        }
      );

      smtp.sendMail({
        from: config.SMTP_DEFAULT_FROM,
        to: `${user.email}`,
        subject: "Activate account.",
        html: `<h1>Hello ${user.email}.</h2> 
        <p>This is your activation code.</p>
        <p>${activateToken}</p>`
      });

      res.status(200).json({
        message: "A new activation code has been sent to your email address."
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

      const activateToken = jwt.sign(
        { id: user._id },
        req.app.get("secretKey"),
        {
          expiresIn: req.app.get("tokenExpiresIn")
        }
      );

      smtp.sendMail({
        from: config.SMTP_DEFAULT_FROM,
        to: `${user.email}`,
        subject: "Activate account.",
        html: `<h1>Hello ${user.email}.</h2> 
        <p>This is your activation code.</p>
        <p>${activateToken}</p>`
      });

      res.status(201).json({
        message:
          "User account is created. Check your email to get activation code."
      });
    } catch (error) {
      return next(error);
    }
  }
};
