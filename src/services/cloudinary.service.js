const { configEnv } = require("../config/index")
const cloudinary = require('cloudinary').v2;
cloudinary.config({
  cloud_name: configEnv.CLOUDINARY_NAME,
  api_key: configEnv.CLOUDINARY_API_KEY,
  api_secret:configEnv.CLOUDINARY_API_SECRET
})

export default cloudinary