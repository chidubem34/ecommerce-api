const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const path = require("path");

//upload multiple images
const uploadMultipleImagesToCloudinary = async (files) => {
    const imageUploadPromises = files.map((file) => {
        const filePath = path.join(__dirname, "../public", "images", file.filename);

        return new Promise((resolve, reject) => {
            cloudinary.uploader.upload(
                filePath,
                {
                    resource_type: "image",
                    upload_preset: "kodecamp",
                },
                (error, result) => {
                    if (error) {
                        return reject(error);
                    }
                    fs.unlinkSync(filePath);
                    resolve(result.secure_url);
                }
            );
        });
    });

    return Promise.all(imageUploadPromises);
};

//upload single images
const uploadSingleImageToCloudinary = async (file) => {
    try {
        const uploadResult = await cloudinary.uploader.upload(file, {
            resource_type: "image",
            upload_preset: "kodecamp",
        });

        // Remove the local file after successful upload
        fs.unlink(file, (err) => {
            if (err) {
                console.error(`Failed to delete local file: ${file}`, err);
            }
        });

        return uploadResult.secure_url;
    } catch (error) {
        throw new Error(`Error uploading image: ${error.message}`);
    }
};

module.exports = {
    uploadMultipleImagesToCloudinary,
    uploadSingleImageToCloudinary,
};