const express = require("express");

const pool = require("./database");

const app = express();

app.use(express.json());

// POST Register: Enter a new user into the database
app.post("/api/v1/register", async (req, res) => {

	try {

		const { email, firstName, lastName, dateOfBirth, heightFt, heightIn, school, position } = req.body;

		const user = await pool.query("INSERT INTO ACCOUNTINFO (EMAIL, FIRSTNAME, LASTNAME, DATEOFBIRTH, HEIGHTINFEET, HEIGHTININCHES, SCHOOL, PLAYERPOSITION) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",

			[email, firstName, lastName, dateOfBirth, heightFt, heightIn, school, position]

		);

		res.json(user);

	} catch (err) {

		console.log(err);

	}

})

// GET Register: Return a user from the database by their email
app.get("/api/v1/register/:email", async (req, res) => {

	try {

		const email = req.params.email;

		const user = await pool.query("SELECT * FROM ACCOUNTINFO WHERE EMAIL = $1",

			[email]

		);

		return res.json(user);

	} catch (err) {

		console.log(err);

	}

});

// DELETE Register: Delete a user from the database by their email
app.delete("/api/v1/register/:email", async (req, res) => {

	try {

		const email = req.params.email;

		const user = await pool.query("DELETE FROM ACCOUNTINFO WHERE EMAIL = $1",

			[email]

		);

		return res.json(user);

	} catch (err) {

		console.log(err);

	}

});

app.put("/api/v1/register/:email", async (req, res) => {

	try {

		const email = req.params.email;

		const { firstName, lastName, dateOfBirth, heightFt, heightIn, school, position } = req.body;

		const user = await pool.query("UPDATE ACCOUNTINFO SET FIRSTNAME = $1, LASTNAME = $2, DATEOFBIRTH = $3, HEIGHTINFEET = $4, HEIGHTININCHES = $5, SCHOOL = $6, PLAYERPOSITION = $7 WHERE EMAIL = $8", 

			[firstName, lastName, dateOfBirth, heightFt, heightIn, school, position, email]

		);

		return res.json(user);

	} catch (err) {

		console.log(err);

	}

});

app.listen(5000, () => {

	console.log("Server opened on port 5000")

});