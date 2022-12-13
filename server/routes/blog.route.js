// node_modules
const router = require("express").Router();

// controllers
const { blogController } = require("../controllers");

// utils
const { checkAuth } = require("../utils");

router.get("/blogs", checkAuth, blogController.blogList);
router.get("/blogsingle/:id", checkAuth, blogController.blogSingle);
router.post("/insert", checkAuth, blogController.blogInsert);
router.put("/update/:id", checkAuth, blogController.blogUpdate);
router.get("/thumbUp/:id", checkAuth, blogController.blogThumbUp)
router.delete("/:id", checkAuth, blogController.blogDelete);

module.exports = router;
