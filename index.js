const express = require("express");
const { postgraphile } = require("postgraphile");
const cors = require("cors");
const app = express();
const pool = require("./database");

app.use(

	postgraphile(

		"postgres://postgres:admin@localhost:5432/wc_test",
		"public",
		{
			watchPg: true,
			graphiql: true,
			enchanceGraphiql: true
		}
	)

);
app.use(cors());
app.use(express.json());

// GET Signup to check if user exists in database
app.get("/signup/:userId", async (req, res) => {

	try {

		const user = req.params.userId;

		const userExists = await pool.query("SELECT EXISTS(SELECT * FROM LOGIN_INFO WHERE USERID = $1)",

			[user]

		);

		return res.json(userExists);

	} catch (err) {

		console.log(err);

	}

});

// POST Signup to enter userId into database
app.post("/signup", async (req, res) => {

	try {

		const { userId, loginDomain } = req.body;

		const newUser = await pool.query("INSERT INTO LOGIN_INFO (USERID, LOGINDOMAIN) VALUES ($1, $2)",

			[userId, loginDomain]

		);

		res.json(newUser);

	} catch (err) {

		if (err.code === '23505') {

			console.log("Duplicate login info");

		} else {

			console.log(err);

		}

	}

})

app.listen(5000, () => {

	console.log("Server opened on port 5000")

});



