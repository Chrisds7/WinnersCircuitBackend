// Dependencies

// Express and Axios for HTTP handling
const express = require("express");
const axios = require('axios');

// Postgres database information
const pool = require('./database');

// Cross site forgery protection
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const csrf = require('csurf');

// Dotenv
require('dotenv').config();

// Instantiate app
const app = express();

// Set up csrf middleware
const csrfProtection = csrf({ cookie: true });
const parseForm = bodyParser.urlencoded({ extended: false });

// Express middleware
app.use(express.json());
app.use(cookieParser());

// GET Route: CSURF Token
app.get('/api/v1/csurf', csrfProtection, function(req, res) {

	res.send({ csrfToken: req.csrfToken() });

});

// POST Register: Enter a new user into the database
app.post("/api/v1/register", parseForm, csrfProtection, async (req, res) => {

	try {

		// Destructure the request body
		const { authId, authName, authFamilyName, authGivenName, email, emailVerified, firstName, lastName, dateOfBirth, heightFt, heightIn, school, position } = req.body;

		// Add the user to the database
		const user = await pool.query(`

			INSERT INTO ACCOUNTINFO 
			(AUTHID, AUTHNAME, AUTHFAMILYNAME, AUTHGIVENNAME, EMAIL, EMAILVERIFIED, FIRSTNAME, LASTNAME, DATEOFBIRTH, HEIGHTINFEET, HEIGHTININCHES, SCHOOL, PLAYERPOSITION) 
			VALUES 
			($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,

			[authId, authName, authFamilyName, authGivenName, email, emailVerified, firstName, lastName, dateOfBirth, heightFt, heightIn, school, position]

		);

		// JSON payload to update user metadata
		const payload = { 

			"user_metadata": { "registrationState": "Registered" } 

		}

		// HTTP headers to update user metadata
		const headers = {

			"Authorization": `Bearer ${process.env.AUTH0_API_TOKEN}`,
			"Content-Type": "application/json"

		}

		// Send a post request to the Auth0 Management API and update the registration status of the user
		await axios.patch(`https://winnerscircuit.us.auth0.com/api/v2/users/${authId}`, payload, {

			headers: headers

		}).then((response) => {

			console.log("Successfully updated user registration status!");

		}).catch((err) => {

			console.log(err);

		})

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

		console.log(user);

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

app.get("/api/v1/userMetadata/:authId", async(req, res) => {

	try {

		res.setHeader('Content-Type', 'application/json');

		const authId = req.params.authId;

		const headers = {

			"Authorization": `Bearer ${process.env.AUTH0_API_TOKEN}`

		}

		const user = await axios.get(`https://winnerscircuit.us.auth0.com/api/v2/users/${authId}`, {

			headers: headers

		});

		return res.json(user.data);

	} catch (err) {

		console.log(err);

	}

});

app.listen(5000, () => {

	console.log("Server opened on port 5000")

});