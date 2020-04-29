const path = require('path');
const multer = require('multer');
const upload = multer({
	dest: path.join(__dirname, '../public/images'),
	preservePath: true,
});

module.exports = upload;
