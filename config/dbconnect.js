const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://127.0.0.1:27017/BlogReviewFood')
  .then(() => console.log('Connected!'))
  .catch((err) => console.log(err.message));