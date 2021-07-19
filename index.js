const express = require("express");

const pool = require("./database");

const app = express();

app.use(express.json());

// POST Register: Enter a new user into the database
app.post("/api/v1/register", async (req, res) => {

	try {

		const { authId, authName, authFamilyName, authGivenName, email, emailVerified, firstName, lastName, dateOfBirth, heightFt, heightIn, school, position } = req.body;

		const user = await pool.query(`

			INSERT INTO ACCOUNTINFO 
			(AUTHID, AUTHNAME, AUTHFAMILYNAME, AUTHGIVENNAME, EMAIL, EMAILVERIFIED, FIRSTNAME, LASTNAME, DATEOFBIRTH, HEIGHTINFEET, HEIGHTININCHES, SCHOOL, PLAYERPOSITION) 
			VALUES 
			($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,

			[authId, authName, authFamilyName, authGivenName, email, emailVerified, firstName, lastName, dateOfBirth, heightFt, heightIn, school, position]

		);

		res.json(user);

	} catch (err) {

		console.log(err);

	}

})

// GET Register: Return a user from the database by their AuthId
app.get("/api/v1/register/:authId", async (req, res) => {

	try {

		const authId = req.params.authId;

		const user = await pool.query("SELECT * FROM ACCOUNTINFO WHERE AUTHID = $1",

			[authId]

		);

		return res.json(user);

	} catch (err) {

		console.log(err);

	}

});

// DELETE Register: Delete a user from the database by their AuthId
app.delete("/api/v1/register/:authId", async (req, res) => {

	try {

		const authId = req.params.authId;

		const user = await pool.query("DELETE FROM ACCOUNTINFO WHERE AUTHID = $1",

			[authId]

		);

		return res.json(user);

	} catch (err) {

		console.log(err);

	}

});

app.put("/api/v1/register/:authId", async (req, res) => {

	try {

		const authId = req.params.authId;

		const { authName, authFamilyName, authGivenName, email, emailVerified, firstName, lastName, dateOfBirth, heightFt, heightIn, school, position } = req.body;

		const user = await pool.query(`

			UPDATE ACCOUNTINFO SET 
			AUTHNAME = $1, AUTHFAMILYNAME = $2, AUTHGIVENNAME = $3, EMAIL = $4, EMAILVERFIED = $5, 
			FIRSTNAME = $6, LASTNAME = $7, DATEOFBIRTH = $8, HEIGHTINFEET = $9, HEIGHTININCHES = $10, 
			SCHOOL = $11, PLAYERPOSITION = $12 
			WHERE AUTHID = $13`, 

			[authName, authFamilyName, authGivenName, email, emailVerified, firstName, lastName, dateOfBirth, heightFt, heightIn, school, position, authId]

		);

		return res.json(user);

	} catch (err) {

		console.log(err);

	}

});

app.listen(5000, () => {

	console.log("Server opened on port 5000")

});