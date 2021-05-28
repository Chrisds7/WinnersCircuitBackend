const express = require("express");
const cors = require("cors")
const app = express()
const pool = require("./database")

app.use(cors());
app.use(express.json());

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



