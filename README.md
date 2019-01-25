# TesseraWorks API Boiler Plate
Edit config.json to use your gmail username/password.

### Register: `api/register`
Once the user registers, they will get an email to validate their account.

Post:
- firstName
- lastName
- email
- username
- password
- description (not required)

Returns:
```
{
	auth: Boolean,
	message: String,
	redirect: {
		url: String,
		timeout: Integer,
		url: String
	}
}
```


### Login: `api/login`
Requires these params in the post request:
- username (email or username can be used here)
- password

Returns:
```
{
	auth: Boolean,
	message: String,
	//If successful it will return the following.
	token: String,
	user: Object
}
```


### Reset Password
To reset a user's password, an authentication email must be sent to the user to confirm their identity. The email will contain a special link in the format xxxxxxx.com/api/passwordReset/uniqueKey. The key is temporary and expires within 1 hour. Once a post request is submitted from this url, the server will validate the key and update the password.

The process needs to be initiated by sending a post request to `api/sendPasswordReset` using these params in the body:
- email

This will send the password reset link to the user's email. A post request now needs to be sent to the unique URL `api/passwordReset/uniqueKey` with these params in the body:
- password

###
