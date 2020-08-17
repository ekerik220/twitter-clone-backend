import cloudinary from "cloudinary";

export const processUpload = async (upload: any) => {
  const { stream } = await upload;

  console.log(stream);

  let resultUrl = "";
  const cloudinaryUpload = async (stream: any) => {
    try {
      await new Promise((resolve, reject) => {
        const streamLoad = cloudinary.v2.uploader.upload_stream(function (
          error,
          result
        ) {
          if (result) {
            resultUrl = result.secure_url;
            resolve(resultUrl);
          } else {
            reject(error);
          }
        });

        stream.pipe(streamLoad);
      });
    } catch (err) {
      throw new Error(`Failed to upload picture ! Err:${err.message}`);
    }
  };

  await cloudinaryUpload(stream);
  return resultUrl;
};
