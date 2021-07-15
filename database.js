const Pool = require("pg").Pool

const pool = new Pool({

	connectionString: process.env.DATABASE_CONNECTION_STRING,

	ssl: {

		rejectUnauthorized: false,

	},

});

module.exports = pool;
