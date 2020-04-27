if (!process.env.DB_URI) throw new Error(`Missing required envs DB_URI`);

module.exports = {
  dbUri: process.env.DB_URI,
};
