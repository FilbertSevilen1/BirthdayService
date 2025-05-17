const UserModel = require("../models/User");

const { createUserSchema } = require("../helpers/schema-validation.js");
const {
  errorResponse,
  successResponse,
} = require("../utils/response-template");

module.exports.CreateUser = async (req, res) => {
  try {
    const body = req.body;

    const { error } = createUserSchema.validate(body);
    if (error) {
      return errorResponse(res, 400, {}, error.details[0].message);
    }
    const currentDate = new Date();
    const newUser = new UserModel({
      ...body,
      createdDate: currentDate,
      updatedDate: currentDate,
    });

    await newUser.save();
    return successResponse(res, {}, "Create User Success");
  } catch (err) {
    return errorResponse(res, 400, {}, err.message);
  }
};

module.exports.GetUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const users = await UserModel.findById(id);
    if (!users) {
      return errorResponse(res, 404, users, "User not Found");
    }
    return successResponse(res, users, "Get User Success");
  } catch (err) {
    return errorResponse(res, 400, {}, err.message);
  }
};

module.exports.UpdateUserById = async (req, res) => {
  try {
    const body = req.body;
    const { id } = req.params;

    const { error } = createUserSchema.validate(body);
    if (error) {
      return errorResponse(res, 400, {}, error.details[0].message);
    }

    const currentDate = new Date();
    const updatedUser = await UserModel.findOneAndUpdate(
      { _id: id },
      {
        ...body,
        updatedDate: currentDate,
      }
    );
    if (!updatedUser) {
      return errorResponse(res, 404, updatedUser, "User not Found");
    }
    return successResponse(res, {}, "Update User Success");
  } catch (err) {
    return errorResponse(res, 400, {}, err.message);
  }
};

module.exports.DeleteUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const users = await UserModel.findByIdAndDelete(id);
    if (!users) {
      return errorResponse(res, 404, users, "User not Found");
    }
    return successResponse(res, users, "Delete User Success");
  } catch (err) {
    return errorResponse(res, 400, {}, err.message);
  }
};
