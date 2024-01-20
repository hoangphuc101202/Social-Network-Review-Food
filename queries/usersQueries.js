const userModel = require('../model/usersModel');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
module.exports = {
    getUsersByID : async (id) => {
        const usersData = await userModel.findById({_id: id})
        return usersData;
    },
    updateUsers: async (fullname, email, phone, dob, gender,hinhanh, id) => {
        try {
            const userUpdate = await userModel.updateOne(
                { _id: id },
                {
                    $set: {
                        fullname: fullname,
                        email: email,
                        phone: phone,
                        birthday: dob,
                        imageUser: `/image/${hinhanh}`,
                        gender: gender
                    }
                }
            );
            return userUpdate;
        } catch (error) {
            console.log(error.message);
        } 
    },
    getUserByID : async (idUser) => {
        
    }
    
}