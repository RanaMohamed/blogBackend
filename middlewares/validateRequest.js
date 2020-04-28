const { validationResult } = require('express-validator');

module.exports = (validatorArray) => async (req, res, next) => {
	const promises = validatorArray.map((validator) => validator.run(req));
	await Promise.all(promises);

	if (!validationResult(req).isEmpty()) next(validationResult(req).mapped());

	next();
};
