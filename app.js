const express = require('express');
const compression = require('compression');
const path = require('path');
const cors = require('cors');
const app = express();

require('express-async-errors');
require('./db');

const userRouter = require('./routes/users');
const articleRouter = require('./routes/articles');
const { port } = require('./config/config');

app.use(cors());
app.use(compression());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(['/users', '/user'], userRouter);

app.use(['/articles', '/article'], articleRouter);

app.use(function (req, res, next) {
	res.status(404).send("Sorry can't find that!");
	next();
});

app.use(function (err, req, res, next) {
	console.log(err);
	const status = res.statusCode == 401 ? 401 : 500;
	const message = res.statusCode == 401 ? err.message : 'Something broke!';
	res.status(status).json({
		message,
		errors: err,
	});
	next();
});

app.listen(port, () => {
	console.info(`App Listening on port ${port}`);
});
