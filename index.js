const express = require ('express');
const md5 = require('md5');
const app = express();
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const http = require('http').Server(app);
const io = require('socket.io')(http);
const passport = require('passport')
const passportSetup = require('./config/passport.config');
app.use(cookieParser());
app.use(session({
    secret: 'your-secret-key', 
    resave: true,
    saveUninitialized: true
  }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('./public'));
require('./config/dbconnect');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      if (
        file.mimetype === "image/jpeg" ||
        file.mimetype === "image/jpg" ||
        file.mimetype === "image/png" ||
        file.mimetype === "image/webp"
      ) {
        cb(null, './public/image'); // Thư mục để lưu hình ảnh
      } else {
        cb(new Error('Không phải là hình ảnh'), false);
      }
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + '.jpg');
    }
  });
  
const upload = multer({ storage: storage });
module.exports = {
  upload : upload,
  io: io
}
const homeRouter = require('./routes/home_route')
app.use('/', homeRouter);
const authRouter = require('./routes/authRouter');
app.use('/auth',authRouter)
const userRouter = require('./routes/users_route');
app.use('/users',userRouter);
http.listen(3000, () => {
  console.log('App listening on port 3000');
});