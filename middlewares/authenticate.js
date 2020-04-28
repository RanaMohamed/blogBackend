const User = require('../models/user');

module.exports = async (req, res, next) => {
	try {
		const user = await User.getUserFromToken(req.headers.authorization);
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
