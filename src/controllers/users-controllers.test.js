const UserController = require("../controllers/users-controllers");
const UserModel = require("../models/User");
const { createUserSchema } = require("../helpers/schema-validation");

jest.mock("../models/User");

describe("User Controller", () => {
  let req, res;

  beforeEach(() => {
    req = { body: {}, params: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe("CreateUser", () => {
    it("should return 400 if validation fails", async () => {
      req.body = {};
      await UserController.CreateUser(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalled();
    });

    it("should return 400 if birthday format invalid", async () => {
      req.body = {
        name: "Test",
        email: "test@gmail.com",
        birthday: "2025-10-11T00:00:00.000+07",
        timezone: "Asia/Jakarta",
      };
      await UserController.CreateUser(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalled();
    });

    it("should return 400 if Email format invalid", async () => {
      req.body = {
        name: "Test",
        email: "testgmail.com",
        birthday: "2025-10-11T00:00:00.000+07:00",
        timezone: "Asia",
      };
      await UserController.CreateUser(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalled();
    });

    it("should return 400 if Timezone format invalid", async () => {
      req.body = {
        name: "Test",
        email: "test@gmail.com",
        birthday: "2025-10-11T00:00:00.000+07:00",
        timezone: "Asia",
      };
      await UserController.CreateUser(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalled();
    });

    it("should create user and return success response", async () => {
      req.body = {
        name: "Test",
        email: "test@gmail.com",
        birthday: "2025-10-11T00:00:00.000+07:00",
        timezone: "Asia/Jakarta",
      };
      UserModel.mockImplementation((data) => ({
        ...data,
        save: jest.fn().mockResolvedValue(data),
      }));

      await UserController.CreateUser(req, res);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: "Create User Success" })
      );
    });
  });

  describe("GetUserById", () => {
    it("should return 404 if user not found", async () => {
      req.params.id = "123";
      UserModel.findById.mockResolvedValue(null);

      await UserController.GetUserById(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("should return user if found", async () => {
      req.params.id = "123";
      const user = { _id: "123", name: "John" };
      UserModel.findById.mockResolvedValue(user);

      await UserController.GetUserById(req, res);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          data: user,
          message: "Get User Success",
        })
      );
    });
  });

  describe("UpdateUserById", () => {
    it("should return 400 if validation fails", async () => {
      req.body = {};
      await UserController.UpdateUserById(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should return 400 if Email format invalid", async () => {
      req.body = {
        name: "Test",
        email: "testgmail.com",
        birthday: "2025-10-11T00:00:00.000+07:00",
        timezone: "Asia/Jakarta",
      };
      await UserController.UpdateUserById(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should return 400 if Birthday format invalid", async () => {
      req.body = {
        name: "Test",
        email: "test@gmail.com",
        birthday: "2025-10-11T00:00:00.000+07",
        timezone: "Asia/Jakarta",
      };
      await UserController.UpdateUserById(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should return 400 if Timezone format invalid", async () => {
      req.body = {
        name: "Test",
        email: "test@gmail.com",
        birthday: "2025-10-11T00:00:00.000+07:00",
        timezone: "Asia",
      };
      await UserController.UpdateUserById(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should return 404 if user not found", async () => {
      req.params.id = "123";
      req.body = {
        name: "Test Sevilen",
        email: "test@gmail.com",
        birthday: "2025-10-11T00:00:00.000+07:00",
        timezone: "Asia/Jakarta",
      };
      UserModel.findOneAndUpdate.mockResolvedValue(null);

      await UserController.UpdateUserById(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("should update user and return success", async () => {
      req.params.id = "123";
      req.body = {
        name: "Test Sevilen",
        email: "test@gmail.com",
        birthday: "2025-10-11T00:00:00.000+07:00",
        timezone: "Asia/Jakarta",
      };
      UserModel.findOneAndUpdate.mockResolvedValue({ _id: req.params.id });

      await UserController.UpdateUserById(req, res);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: "Update User Success" })
      );
    });
  });

  describe("DeleteUserById", () => {
    it("should return 404 if user not found", async () => {
      req.params.id = "123";
      UserModel.findByIdAndDelete.mockResolvedValue(null);

      await UserController.DeleteUserById(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("should delete user and return success", async () => {
      req.params.id = "123";
      const user = {
        name: "Test Sevilen",
        email: "test@gmail.com",
        birthday: "2025-10-11T00:00:00.000+07:00",
        timezone: "Asia/Jakarta",
      };
      UserModel.findByIdAndDelete.mockResolvedValue(user);

      await UserController.DeleteUserById(req, res);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          data: user,
          message: "Delete User Success",
        })
      );
    });
  });
});
