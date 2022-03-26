const mongoose = require('mongoose');
const { configEnv } = require('./index');

async function connect() {
	try {
		await mongoose.connect(configEnv.MONGO_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useFindAndModify: false,
			useCreateIndex: true
		});
		console.log('connect successfully!');
	} catch (error) {
		console.log(configEnv.MONGO_URI)
		console.log(error);
		console.log('connect fail!!');
	}
}

module.exports = { connect };
