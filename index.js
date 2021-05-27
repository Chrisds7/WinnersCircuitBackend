const express = require("express");
const cors = require("cors")
const app = express()
const pool = require("./database")

app.use(cors());
app.use(express.json());

app.post("/signup", async (req, res) => {

	try {

		const { google_id, firstname, lastname, email } = req.body;

		const newUser = await pool.query("INSERT INTO LOGIN_INFO (GOOGLE_ID, FIRSTNAME, LASTNAME, EMAIL) VALUES ($1, $2, $3, $4)",
			[google_id, firstname, lastname, email]
		);

		res.json(newUser);

	} catch (err) {

		if (err.code === '23505') {

			console.log("User already exists in database.")

		} else {

			console.log(err);

		}

	}

})

app.listen(5000, () => {

	console.log("Server opened on port 5000")

});



