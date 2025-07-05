const validator = require('validator');

const nameValidator = ({ name, isRequired=false, checkIfEnough=false }) => {
    if (isRequired && (typeof name !== 'string' || !name.trim())) 
        throw Error("Name should not be empty");

    if (checkIfEnough && (name && name.trim().length < 2)) 
        throw Error('Name should be greater than 2 characters');
}

const emailValidator = ({ email, isRequired=false }) => {
    if (isRequired && (typeof email !== 'string' || !email.trim())) 
        throw Error("Email should not be empty");

    if (email && !validator.isEmail(email)) 
        throw Error('Please enter a valid email');
} 

const passwordValidator = ({ password, isRequired=false, checkIfEnough=false, checkIfStrong=false }) => {
    // PASSWORD VALIDATOR = should not be empty
    if ( isRequired && (typeof password !== 'string' || !password.trim())) 
        throw Error("Password should not be empty");

    // PASSWORD VALIDATOR = should not fall below 8 characters
    if (checkIfEnough && password.length < 8) 
        throw Error('Password should not be less than 8 characters');

    // PASSWORD VALIDATOR = should have atleast 1 letter and number
    if (checkIfStrong && (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password))) 
        throw Error('Password should have at least 1 character and number');
}


module.exports = {
    nameValidator,
    emailValidator,
    passwordValidator
}