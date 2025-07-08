const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

module.exports = function userEditStatics (schema) {   
    /**
     * User edit method
     * Updates user information with validation
     */
    schema.statics.userEditModel = async function(userId, name, currentPassword, newPassword) {
        if (!mongoose.Types.ObjectId.isValid(userId))
            throw Error('User ID is invalid');
        
        // Find the user
        const user = await this.findOne({ _id: userId });
        
        if (!user) {
            throw Error('User not found');
        }

        const updateFields = {}

        if (name) {
            if (name.toLowerCase() === user.name.toLowerCase()){
                throw Error('New name should be different from the current name')
            }
            updateFields.name = name
        } 


       // VERIFY CURRENT PASSWORD AND UPDATE A NEW ONE
        if (currentPassword && newPassword) {
            const match = await bcrypt.compare(currentPassword, user.password);
            if (!match) throw Error('Incorrect current password');

            // Hash new password
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(newPassword, salt);
            updateFields.password = hash;
        }

        // Ensure there's something to update
        if (Object.keys(updateFields).length === 0) {
            throw Error('No changes to update');
        }

        // Update the user
        const updatedUser = await this.findByIdAndUpdate(
            user._id, 
            updateFields, 
            { new: true }
        );
        
        return updatedUser;
    }

    /**
     * User delete method
     * Permanently removes a user account
     */
    schema.statics.deleteUserModel = async function(userId, password) {
        if (!mongoose.Types.ObjectId.isValid(userId)) 
            throw Error('Invalid User ID');

        // Find the user
        const user = await this.findOne({ _id: userId });

        if(!user) {
            throw Error("User not found");
        }

        // Verify password
        const match = await bcrypt.compare(password, user.password);
        
        if(!match) {
            throw Error("Invalid password");
        }

        // Delete the user
        await user.deleteOne();
        return user;
    }
}
