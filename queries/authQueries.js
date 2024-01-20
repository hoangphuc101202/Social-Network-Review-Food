const userModel = require('../model/usersModel');
const bcryptjs = require('bcryptjs');
const saltRounds = 10;
module.exports = {
    registerQueries : async (fullname, email, password, defaultImageUser) => {
        const hashPassword = await bcryptjs.hash(password, saltRounds);
        const data = await userModel.create({
            fullname: fullname,
            email: email,
            password: hashPassword,
            imageUser: defaultImageUser
        });
        return data;
        
    },
    imageUsers : async (email) => {
        const image = await userModel.findOne({email: email}, {_id: 1, imageUser: 1});
        return image;
    }
    
    
}