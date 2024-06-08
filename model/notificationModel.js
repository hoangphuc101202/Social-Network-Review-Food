const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const notiSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId, 
        ref: 'User', // Tham chiếu đến mô hình User (nếu bạn có mô hình User)
        required: true,
      },
      type: {
        type: String,
        enum: ['comment', 'follower', 'other'],
        required: true,
      },
      postId: {
        type: Schema.Types.ObjectId,
        ref: 'Posts', // Tham chiếu đến mô hình Post (nếu bạn có mô hình Post)
      },
      senderId: {
        type: Schema.Types.ObjectId,
        ref: 'User', 
      },
      isRead: {
        type: Boolean,
        default: false,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
});
const notificationModel = mongoose.model('Notification', notiSchema);
module.exports = notificationModel;