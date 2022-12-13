// node_modules
const router = require("express").Router();

// sub routes
const authRoute = require("./auth.route");
const usersRoute = require("./users.route");
const blogRoute = require("./blog.route");
const uploadRoute = require("./upload.route");

router.use("/auth", authRoute);
router.use("/users", usersRoute);
router.use("/blog", blogRoute);
router.use("/upload", uploadRoute);

module.exports = router;
