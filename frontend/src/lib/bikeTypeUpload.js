
export const uploadImage = async (file) => {
    if (!file) return null;

    const formData = new FormData();

    formData.append("file", file);
    formData.append(
        "upload_preset",
        "bike_type_upload"
    );

    try {
        const response = await fetch(
            `https://api.cloudinary.com/v1_1/dp3vkgxtb/image/upload`,
            {
                method: "POST",
                body: formData
            }
        );

        const data = await response.json();

        if (!response.ok) {
            console.error(data);
            throw new Error("Image upload failed");
        }

        return data.secure_url;

    } catch (error) {
        console.error("Cloudinary error:", error);
        return null;
    }
};