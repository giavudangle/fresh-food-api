require('dotenv').config();

const configEnv = {
	ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
	JWT_KEY: process.env.JWT_KEY,
	MONGO_URI: 'mongodb+srv://hytran:hytran@cluster0.06alb.mongodb.net/fresh-food-database?retryWrites=true&w=majority',
	PORT: process.env.PORT,
	BUCKET: process.env.BUCKET,
	REGION: process.env.REGION,
	AWS_ACCESS_KEY: process.env.AWS_ACCESS_KEY,
	AWS_SECRET_KEY: process.env.AWS_SECRET_KEY,
	Email: process.env.Email,
	Password: process.env.Password,
	ID_Client: process.env.ID_Client,
	Secret: process.env.Secret,
	API_GHTK: process.env.API_GHTK,
	Account_SID: process.env.Account_SID,
	Auth_Token: process.env.Auth_Token,
	Phone: process.env.Phone,
	CLOUDINARY_NAME: process.env.CLOUDINARY_NAME,
	CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
	CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,

};

const DFRoleValue = ["User", "Admin","Staff"]

module.exports = {
	configEnv,
	DFRoleValue
};
