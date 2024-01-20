const {imageUsers} = require('../queries/authQueries');
const {getCategoryPost} = require('../queries/categoryQueries')

module.exports = {
    categoryController : async (req,res,next) => {
        let showLogin  = false;
        const payload = req.payload;
        if(!payload){
            showLogin = true
            res.render('category', {showLogin: showLogin});
        }else{
            const {imageUser, _id} = await imageUsers(payload.email);
            const idUser = _id.toString()
            res.render('category', 
            {
                showLogin: showLogin,
                usersId : idUser,
                userImage : imageUser,
                userFullName : payload.fullname
            })
        }
    },
    getPostFromCategory : async (req,res,next) => {
        const city = req.params.categoryName;
        const postsFromCategory = await getCategoryPost(city);
        let showLogin  = false;
        const payload = req.payload;
        if(!payload){
            showLogin = true
            res.render('home', {showLogin: showLogin, data : postsFromCategory, city: city});
        }
        else{
            const {imageUser, _id} = await imageUsers(payload.email);
            const idUser = _id.toString()
            res.render('home', 
            {   data : postsFromCategory,
                showLogin: showLogin,
                city: city,
                usersId : idUser,
                userImage : imageUser,
                userFullName : payload.fullname
            })
        }
    }
}