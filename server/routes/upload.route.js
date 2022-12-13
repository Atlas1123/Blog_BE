const router = require("express").Router();

const { uploadController } = require("../controllers");

const { imageUploader } = require("../utils");

router.post(
    "/image", 
    imageUploader.array("imageCollection", 2),
    uploadController.uploadImage
);

module.exports = router;