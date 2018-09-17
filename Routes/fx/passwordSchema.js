let passwordValidator = require('password-validator');

let passwordSchema = new passwordValidator();
passwordSchema
.is().min(8)
.is().max(64)
.has().uppercase()
.has().lowercase()
.has().digits();

module.exports = passwordSchema;
