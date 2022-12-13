const { UPLOAD_URL } = require("../config");
const { Response } = require("../utils");

const uploadImage = async (req, res, next) => {
    try {
        const getBodyFileName = (file) => `${UPLOAD_URL}/${file.filename}`;
        const reqFiles = req.files.map(getBodyFileName);

        Response(res, 200, {
            imageUrls: reqFiles,
        });
    } catch(error) { 
        console.log(error);
        res.status(500).json({ message: "Error" })
     }
};

module.exports = {
    uploadImage,
};