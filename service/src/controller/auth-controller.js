const User = require("../models/user");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../lib/utils");
const AuthValidator = require("../validation/auth-validator");
const cloudinary = require("cloudinary").v2;

class AuthController {
  static async signUpController(req, res) {
    const data = req.body;
    let response;

    try {
      const signUpValidator = new AuthValidator("sign-up", data);
      const { error } = signUpValidator.validate();

      if (error) {
        response = { status: 400, body: { message: "Validation failed", errors: error } };
      } else {
        const existingUser = await User.findOne({ email: data.email }).select('-password');

        if (existingUser) {
          response = { status: 400, body: { message: "Email already exists" } };
        } else {
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(data.password, salt);

          const newUser = await User.create({
            fullName: data.fullName,
            email: data.email,
            password: hashedPassword,
          });

          generateToken(newUser._id, res);

          response = {
            status: 201,
            body: {
              message: "User created successfully",
              data: {
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic,
              },
            },
          };
        }
      }
    } catch (error) {
      response = { status: 500, body: { message: "Internal Server Error", error: error.message } };
    }

    res.status(response.status).json(response.body);
  }

  static async loginController(req, res) {
    const data = req.body;
    let response;

    try {
      const loginValidator = new AuthValidator("login", data);
      const { error } = loginValidator.validate();

      if (error) {
        response = { status: 400, body: { message: "Validation failed", errors: error } };
      } else {
        const user = await User.findOne({ email: data.email });

        if (!user) {
          response = { status: 400, body: { message: "Invalid credentials" } };
        } else {
          const isMatch = await bcrypt.compare(data.password, user.password);

          if (!isMatch) {
            response = { status: 400, body: { message: "Invalid credentials" } };
          } else {
            generateToken(user._id, res);
            response = {
              status: 200,
              body: {
                message: "Login successful",
                data: {
                  _id: user._id,
                  fullName: user.fullName,
                  email: user.email,
                  profilePic: user.profilePic,
                  createdAt: user.createdAt,
                  updatedAt: user.updatedAt,
                },
              },
            };
          }
        }
      }
    } catch (error) {
      response = { status: 500, body: { message: "Internal Server Error", error: error.message } };
    }

    res.status(response.status).json(response.body);
  }

  static logoutController(req, res, next) {
    let response;

    try {
      res.cookie("platform-token", "", { maxAge: 0 });
      response = { status: 200, body: { message: "Logged out successfully" } };
    } catch (error) {
      response = { status: 500, body: { message: "Internal Server Error", error: error.message } };
    }

    res.status(response.status).json(response.body);
    next();
  }

  static async updateProfileController(req, res) {
    let response;

    try {
      const { profilePic } = req.body;
      const userId = req.user?._id;

      if (!profilePic) {
        response = { status: 400, body: { message: "Profile picture is required" } };
      } else {
        const uploadResponse = await cloudinary.uploader.upload(profilePic);
        const updatedUser = await User.findByIdAndUpdate(
          userId,
          { profilePic: uploadResponse.secure_url },
          { new: true }
        ).select('-password');

        if (updatedUser) {
          response = {
            status: 200,
            body: {
              message: "Profile updated successfully",
              data: {
                _id: updatedUser._id,
                fullName: updatedUser.fullName,
                email: updatedUser.email,
                profilePic: updatedUser.profilePic,
              },
            },
          };
        } else {
          response = { status: 404, body: { message: "User not found" } };
        }
      }
    } catch (error) {
      response = { status: 500, body: { message: "Internal Server Error", error: error.message } };
    }

    res.status(response.status).json(response.body);
  }

  static checkAuth(req, res) {
    let response;

    try {
      if (!req.user) {
        response = { status: 401, body: { message: "Unauthorized" } };
      } else {
        response = {
          status: 200,
          body: {
            message: "Authenticated",
            data: {
              _id: req.user._id,
              fullName: req.user.fullName,
              email: req.user.email,
              profilePic: req.user.profilePic,
            },
          },
        };
      }
    } catch (error) {
      response = { status: 500, body: { message: "Internal Server Error", error: error.message } };
    }

    res.status(response.status).json(response.body);
  }
}

module.exports = AuthController;
