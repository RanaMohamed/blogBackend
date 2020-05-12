const path = require('path');
const multer = require('multer');

var storage = multer.diskStorage({
	// destination: function (req, file, cb) {
	// 	cb(null, path.join(__dirname, '../public/images'));
	// },
	filename: function (req, file, cb) {
		cb(null, Date.now() + path.extname(file.originalname));
	},
});

const upload = multer({ storage });

module.exports = upload;
