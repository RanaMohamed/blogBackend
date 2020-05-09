const User = require('../models/user');

module.exports = async (req, res, next) => {
	try {
		let user;
		if (req.headers.authorization)
			user = await User.getUserFromToken(req.headers.authorization);
		if (!user) {
			res.status(401);
			throw new Error('Unauthorized');
		}

		req.user = user;
		next();
	} catch (err) {
		next(err);
	}
};
