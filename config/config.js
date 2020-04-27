require('dotenv').config();

// const requiredEnvs = ['JWT_SECRET'];

// const missingEnvs = requiredEnvs.filter((envName) => !process.env[envName]);

// if (missingEnvs.length) {
//   throw new Error(`Missing required envs ${missingEnvs}`);
// }

module.exports = {
	//   jwtSecret: process.env.JWT_SECRET,
	saltRounds: process.env.SALT_ROUNDS || 7,
	port: process.env.PORT || 3000,
};
