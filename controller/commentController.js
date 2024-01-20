const userModel = require('../model/usersModel');
const postModel = require('../model/postModel');
const commentModel = require('../model/commentModel');
const {io} = require('..')
// io.on('connection', (socket) => {
//     socket.on('on-comment', (data) => {
//       console.log('Comment from client:', data.comment);
//       // Xử lý dữ liệu comment ở đây
//     });
//   });
module.exports = {
    addComment : async (req,res,next) => {
      try{
        const idPost = req.params.id; // Điều này sẽ lấy đúng id từ tham số URL
        const author = await userModel.findOne({ email: req.payload.email});
        const newComment = new commentModel({
          author: author._id,
          post: idPost,
          content: req.body.message
        });
        await newComment.save();
        io.emit('new-comment-added', {
          idPost,
          author: author.fullname,
          authorImage: author.imageUser,
          comment: newComment.content,
          date: newComment.createdAt
        });
        io.emit('newConnection', 'Có thông báo')
        res.redirect(`/single-post/${idPost}`);
      }
      catch{
        console.log('error to add comment');
      }
    }
}