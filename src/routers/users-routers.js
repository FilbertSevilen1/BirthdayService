const router = require("express").Router();
const { users } = require("../controllers");

router.post("/", users.createUser);
router.get("/:id", users.getUserById);
router.patch("/:id", users.updateUserById);
router.delete("/:id", users.deleteUserById);

module.exports = router;
