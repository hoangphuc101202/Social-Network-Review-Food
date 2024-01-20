const postModel = require('../model/postModel');
const userModel = require('../model/usersModel');
const commentModel = require('../model/commentModel');
module.exports = {
    postData : async () => {
        const data = postModel.find().populate({path: 'author', select: 'fullname -_id'}).sort({ createdAt: -1 });
        return data;
    },
    CountPostOfUsers : async (idUser) => {
        const count = postModel.countDocuments({author: idUser});
        return count;
    },
    getPostOfUsers : async (idUser) => {
        const data = postModel.find({author: idUser}).sort({ createdAt: -1 });
        return data;
    },
    addPost : async (idAuthor, postTitle, postContent, city, images) => {
        try{
            const postNew = new postModel({
                author: idAuthor,
                title: postTitle,
                content: postContent,
                category: city,
                image: images
            })
            postNew.save()
            .catch((error) => {
                console.log("Error: ", error);
            })
            return postNew;
        }
        catch (err) {
            console.log("Không thể thêm bài Post", err);
        }
    },
    PostDelete : async (idPost) => {
        const resultDelete = await postModel.findByIdAndRemove(idPost);
        return resultDelete;
    },
    updatePost : async (idPost, postTitleEdit, postContentEdit, cityEdit,imageUpdated) =>{
        try{
            const postUpdated = postModel.updateOne(
                { _id: idPost },
                {
                    $set: {
                        title: postTitleEdit,
                        content: postContentEdit,
                        category: cityEdit,
                        image: imageUpdated
                    }
                }
            )
            return postUpdated;
        }
        catch (error){
            console.log("Sửa bài post thất bại", error);
        }
    },
    postDataWithID: async (idPost) => {
        const data = await postModel
        .findById(idPost)
        .populate('author', 'fullname imageUser '); // Loại bỏ trường _id
        return data;
    },
    commentWithPostId: async(idPost) => {
        const data = await commentModel.find({post: idPost})
        .populate('author', 'fullname imageUser ');
        return data;
    }
};
