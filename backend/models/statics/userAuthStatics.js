const bcrypt = require('bcrypt');

module.exports = function userAuthStatics(schema) {

    /**
     * 
     * @param {string} name 
     * @param {string} email 
     * @param {string} password 
     * @returns NEWLY CREATE USER DOCUMENT
     */
    schema.statics.signupModel = async function(name, email, password) {
        // VALIDATES EXISTING EMAIL
        const existingUser = await this.findOne({ email });
        if (existingUser) {
            throw Error('Email is already in use');
        }

        // PASSWORD HASHING
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        // DATABASE DOCUMENT CREATION
        const user = this.create({name, email, password: hash});

        return user;
    }

    /**
     * 
     * @param {string} email 
     * @param {string} password 
     * @returns EXISTING USER
     */
    schema.statics.loginModel = async function(email, password) {
        // VERIFY EXISTING USER
        const user = await this.findOne({ email });
        if (!user) {
            throw Error('User does not exists');
        }
        
        // VERIFY PASSWORD
        const match = await bcrypt.compare(password, user.password);
        if (!match){
            throw Error('Incorrect email or password');
        }

        return user;
    }
}
