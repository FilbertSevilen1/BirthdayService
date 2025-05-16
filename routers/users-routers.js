const router = require("express").Router();
const { users } = require("../controllers");

router.post("/", users.CreateUser);
router.get("/:id", users.GetUserById);
router.patch("/:id", users.UpdateUserById);
router.delete("/:id", users.DeleteUserById);

module.exports = router;
