require('dotenv').config();

const { dbUri } = require('./config/db');

const mongoose = require('mongoose');
mongoose
	.connect(dbUri, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
	})
	.then(() => console.log(`DB Connected Successfully`))
	.catch((err) => console.error(err));
