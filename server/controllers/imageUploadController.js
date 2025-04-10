exports.uploadImage = async(image) => {
    try{
        const uploadedImage = await uploadImageToCloudinary(
            image,
            process.env.FOLDER_NAME,
            1000,
            1000
        )
        console.log(image)
        return uploadedImage.secure_url;

    } catch(err) {
        return err.message;
    }
}